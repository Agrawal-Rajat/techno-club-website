import fs from 'fs';
import path from 'path';

export interface ClubApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  year: string;
  reason: string;
  clubSlug: string;
  clubName: string;
  submittedAt: Date;
}

// Simple CSV system - stores club applications in separate files
// No approval system needed - just direct CSV storage

/**
 * Add a new club application to club-specific CSV file
 */
export async function addClubApplicationToCSV(
  application: ClubApplicationData
): Promise<boolean> {
  try {
    // Create club-specific CSV file path
    const clubSlug = application.clubSlug.toLowerCase();
    const csvFilePath = `./club-applications/${clubSlug}-applications.csv`;
    
    const csvDir = path.dirname(csvFilePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    // Check if file exists, if not create with headers
    if (!fs.existsSync(csvFilePath)) {
      const headers = [
        'First Name',
        'Last Name',
        'Email',
        'Contact Number',
        'Year',
        'Reason',
        'Club Name',
        'Submitted At',
      ];
      
      fs.writeFileSync(csvFilePath, headers.join(',') + '\n');
    }

    // Check if email already exists in this club's CSV
    if (await isEmailAlreadyApplied(application.email, csvFilePath)) {
      return false;
    }

    // Prepare the row data
    const rowData = [
      application.firstName,
      application.lastName,
      application.email,
      application.contactNumber,
      application.year,
      application.reason,
      application.clubName,
      application.submittedAt.toISOString(),
    ];

    // Escape commas and quotes in data
    const escapedData = rowData.map(field => {
      if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    });

    // Append to CSV file
    fs.appendFileSync(csvFilePath, escapedData.join(',') + '\n');

    return true;
  } catch (error) {
    console.error('Error adding application to CSV:', error);
    return false;
  }
}

/**
 * Check if email already exists in the CSV file
 */
async function isEmailAlreadyApplied(email: string, csvFilePath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(csvFilePath)) {
      return false;
    }

    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());

    if (lines.length <= 1) {
      return false; // No data or only header row
    }

    // Check if email exists in any row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(',');
      if (fields[2] === email) { // Email is in column 2 (index 2)
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}


