'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClubType, UserRole } from '@/lib/models/User';

type CSVUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  club: ClubType;
  creditScore: number;
};

type ErrorRow = {
  rowNumber: number;
  error: string;
  data: Record<string, string>;
};

export default function BulkUserUpload() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    failed: number;
  }>({ total: 0, success: 0, failed: 0 });
  
  // Redirect if not authenticated or not admin/superadmin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !['admin', 'superadmin'].includes(session?.user?.role as string)) {
      router.push('/');
    }
  }, [status, session, router]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        if (csvData) {
          // Basic CSV parsing (could be replaced with more robust library)
          const rows = csvData.split('\n');
          const headers = rows[0].split(',');
          
          const parsedData: CSVUser[] = [];
          for (let i = 1; i < Math.min(6, rows.length); i++) {
            if (rows[i].trim() === '') continue;
            
            const values = rows[i].split(',');
            const rowData: Record<string, any> = {};
            
            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index]?.trim() || '';
            });
            
            parsedData.push({
              name: rowData.name || '',
              email: rowData.email || '',
              password: rowData.password || '',
              role: (rowData.role || 'user') as UserRole,
              club: (rowData.club || '') as ClubType,
              creditScore: parseInt(rowData.creditScore) || 0
            });
          }
          
          setPreview(parsedData);
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  
  const validateCSV = (data: CSVUser[]): { valid: boolean; errors: ErrorRow[] } => {
    const errors: ErrorRow[] = [];
    const validRoles = ['user', 'member', 'admin', 'superadmin'];
    const validClubs = ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC', ''];
    
    data.forEach((row, index) => {
      // Check required fields
      if (!row.name || !row.email || !row.password) {
        errors.push({
          rowNumber: index + 1,
          error: 'Missing required field(s): name, email, and password are required',
          data: row as unknown as Record<string, string>
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email)) {
        errors.push({
          rowNumber: index + 1,
          error: 'Invalid email format',
          data: row as unknown as Record<string, string>
        });
      }
      
      // Validate role
      if (row.role && !validRoles.includes(row.role)) {
        errors.push({
          rowNumber: index + 1,
          error: `Invalid role: ${row.role}. Must be one of: ${validRoles.join(', ')}`,
          data: row as unknown as Record<string, string>
        });
      }
      
      // Validate club
      if (row.club && !validClubs.includes(row.club)) {
        errors.push({
          rowNumber: index + 1,
          error: `Invalid club: ${row.club}. Must be one of: ${validClubs.join(', ')}`,
          data: row as unknown as Record<string, string>
        });
      }
      
      // Validate credit score is a number
      if (isNaN(row.creditScore)) {
        errors.push({
          rowNumber: index + 1,
          error: 'Credit score must be a number',
          data: row as unknown as Record<string, string>
        });
      }
    });
    
    return { valid: errors.length === 0, errors };
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setUploadStatus('processing');
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        if (!csvData) {
          setUploadStatus('error');
          setLoading(false);
          return;
        }
        
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');
        
        const allUsers: CSVUser[] = [];
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim() === '') continue;
          
          const values = rows[i].split(',');
          const rowData: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            rowData[header.trim()] = values[index]?.trim() || '';
          });
          
          allUsers.push({
            name: rowData.name || '',
            email: rowData.email || '',
            password: rowData.password || '',
            role: (rowData.role || 'user') as UserRole,
            club: (rowData.club || '') as ClubType,
            creditScore: parseInt(rowData.creditScore) || 0
          });
        }
        
        // Validate the data
        const validation = validateCSV(allUsers);
        if (!validation.valid) {
          setErrors(validation.errors);
          setUploadStatus('error');
          setLoading(false);
          setSummary({
            total: allUsers.length,
            success: 0,
            failed: allUsers.length
          });
          return;
        }
        
        // Send the data to the API
        try {
          const response = await fetch('/api/users/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: allUsers })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            setUploadStatus('success');
            setSummary({
              total: allUsers.length,
              success: result.successCount,
              failed: result.failedCount
            });
          } else {
            setUploadStatus('error');
            setErrors(result.errors || []);
            setSummary({
              total: allUsers.length,
              success: result.successCount || 0,
              failed: result.failedCount || allUsers.length
            });
          }
        } catch (error) {
          console.error('Error uploading users:', error);
          setUploadStatus('error');
          setSummary({
            total: allUsers.length,
            success: 0,
            failed: allUsers.length
          });
        }
        
        setLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing CSV:', error);
      setUploadStatus('error');
      setLoading(false);
    }
  };
  
  const downloadTemplate = () => {
    window.location.href = '/templates/user-upload-template.csv';
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-8">
          Bulk User Upload
        </h1>
        
        <div className="mb-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Upload a CSV file with user information to create multiple users at once.</li>
            <li>Required columns: name, email, password</li>
            <li>Optional columns: role (user, member, admin, superadmin), club (IEEE, ACM, AWS, GDG, STIC), creditScore</li>
            <li>Default values: role = &quot;user&quot;, club = &quot;&quot;, creditScore = 0</li>
            <li>Maximum file size: 1MB</li>
          </ul>
          
          <button
            onClick={downloadTemplate}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
          >
            Download Template
          </button>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select CSV File
            </label>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV file only (MAX. 1MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>
          
          {file && (
            <div className="mb-4">
              <p className="text-green-400">
                File selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
          
          {preview.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Preview (first 5 rows):</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-md">
                  <thead>
                    <tr>
                      {Object.keys(preview[0]).map(key => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-2 text-sm">
                            {value?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 rounded-md text-white"
          >
            {loading ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
        
        {uploadStatus === 'success' && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Upload Successful</h2>
            <div className="mb-4">
              <p className="mb-1">Total users processed: {summary.total}</p>
              <p className="mb-1 text-green-400">Successfully created: {summary.success}</p>
              {summary.failed > 0 && (
                <p className="text-red-400">Failed: {summary.failed}</p>
              )}
            </div>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Upload Failed</h2>
            {summary.total > 0 && (
              <div className="mb-4">
                <p className="mb-1">Total users processed: {summary.total}</p>
                {summary.success > 0 && (
                  <p className="mb-1 text-green-400">Successfully created: {summary.success}</p>
                )}
                <p className="text-red-400">Failed: {summary.failed}</p>
              </div>
            )}
            
            {errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Errors:</h3>
                <div className="overflow-y-auto max-h-64 bg-gray-900 rounded-md p-4">
                  {errors.map((error, index) => (
                    <div key={index} className="mb-3 pb-3 border-b border-red-900/50">
                      <p className="text-red-400">Row {error.rowNumber}: {error.error}</p>
                      <pre className="text-xs mt-1 bg-gray-800 p-2 rounded-md overflow-x-auto">
                        {JSON.stringify(error.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 