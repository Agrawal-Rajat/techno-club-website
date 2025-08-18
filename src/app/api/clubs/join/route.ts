import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import ClubApplication from "@/lib/models/ClubApplication";
import { addClubApplicationToCSV } from "@/lib/csvService";

export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: "Please login first to apply for clubs" },
    //     { status: 401 }
    //   );
    // }

    const {
      firstName,
      lastName,
      email,
      contactNumber,
      year,
      reason,
      clubSlug,
      clubName,
    } = await request.json();

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !year ||
      !reason ||
      !clubSlug ||
      !clubName
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // // Connect to database
    await connectToDatabase();

    // // Check if application already exists for this email and club
    const existingApplication = await ClubApplication.findOne({
      email,
      clubSlug,
      status: { $in: ["pending", "approved"] },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this club" },
        { status: 409 }
      );
    }

    // Create new application
    const application = new ClubApplication({
      firstName,
      lastName,
      email,
      contactNumber,
      year,
      reason,
      clubSlug,
      clubName,
      status: "pending",
      submittedAt: new Date(),
    });

    await application.save();

    // Add application to CSV
    // try {
    //   const csvSuccess = await addClubApplicationToCSV({
    //     firstName: application.firstName,
    //     lastName: application.lastName,
    //     email: application.email,
    //     contactNumber: application.contactNumber,
    //     year: application.year,
    //     reason: application.reason,
    //     clubSlug: application.clubSlug,
    //     clubName: application.clubName,
    //     submittedAt: application.submittedAt,
    //   });

    // if (!csvSuccess) {
    //   return NextResponse.json(
    //     { error: "You have already applied to this club" },
    //     { status: 409 }
    //   );
    // }
    // } catch (error) {
    // console.error("Error adding application to CSV:", error);
    // Continue even if CSV operation fails
    // }

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
