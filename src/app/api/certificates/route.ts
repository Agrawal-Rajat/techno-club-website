import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/User";
import { uploadCertificate } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // Get user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if formData is available
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      return NextResponse.json(
        { error: "Certificate name and file are required" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload file to Cloudinary
    const url = await uploadCertificate(base64File);

    // Find user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize certificates array if it doesn't exist
    if (!user.certificates) {
      user.certificates = [];
    }

    // Add certificate to user
    const newCertificate = {
      name,
      url,
      isVerified: false,
      creditsAwarded: 0,
      submittedAt: new Date(),
    };

    user.certificates.push(newCertificate);
    await user.save();

    // Get the saved certificate with its ID
    const savedCertificate = user.certificates[user.certificates.length - 1];

    return NextResponse.json(
      {
        success: true,
        message: "Certificate uploaded successfully",
        certificate: savedCertificate,
        userId: user._id,
        certificates: user.certificates,
        creditScore: user.creditScore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading certificate:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload certificate";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// API endpoint to verify a certificate (admin only)
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await User.findOne({ email: session.user.email });

    if (
      !adminUser ||
      (adminUser.role !== "admin" && adminUser.role !== "superadmin")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const { userId, certificateId, approved, credits } = await request.json();

    if (
      !userId ||
      !certificateId ||
      approved === undefined ||
      credits === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "User ID, certificate ID, approval status, and credits are required",
        },
        { status: 400 }
      );
    }

    // Find user and update certificate
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find certificate in user's certificates array with proper type handling
    const certificate = user.certificates?.find(
      (cert) => (cert as any)._id.toString() === certificateId
    );

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Update certificate verification status
    certificate.isVerified = approved;
    certificate.creditsAwarded = approved ? credits : 0;
    certificate.verifiedAt = approved ? new Date() : undefined;

    // Update user's credit score if approved
    if (approved) {
      user.creditScore += credits;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: `Certificate ${approved ? "approved" : "rejected"}`,
      certificate: certificate,
      userId: user._id,
      certificates: user.certificates,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        creditScore: user.creditScore,
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to verify certificate";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
