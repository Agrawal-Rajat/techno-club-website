import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Certificate = {
  _id: string;
  name: string;
  url: string;
  isVerified: boolean;
  creditsAwarded: number;
  submittedAt: string;
  verifiedAt?: string;
};

type CertificatesSectionProps = {
  certificates: Certificate[];
  creditScore: number;
  onCertificateUpload?: () => void;
};

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ 
  certificates, 
  creditScore,
  onCertificateUpload 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleCertificateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateName || !certificateFile) {
      setUploadError('Certificate name and file are required');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadError('');
      setUploadSuccess('');
      
      const formData = new FormData();
      formData.append('name', certificateName);
      formData.append('file', certificateFile);
      
      const response = await fetch('/api/certificates', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload certificate');
      }
      
      // Show success message
      setUploadSuccess('Certificate uploaded successfully! Pending verification.');
      
      // Reset form
      setCertificateName('');
      setCertificateFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component to refresh data
      if (onCertificateUpload) {
        setTimeout(() => {
          onCertificateUpload();
        }, 500); // Small delay to ensure server has processed the upload
      }
      
    } catch (err: unknown) {
      console.error('Error uploading certificate:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Certificate Upload Form */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Upload New Certificate</h3>
        
        <form onSubmit={handleCertificateUpload} className="space-y-4">
          {uploadError && (
            <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-3 rounded">
              <div className="flex">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{uploadError}</span>
              </div>
            </div>
          )}
          
          {uploadSuccess && (
            <div className="bg-green-900 border-l-4 border-green-500 text-green-200 p-3 rounded">
              <div className="flex">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{uploadSuccess}</span>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="certificateName" className="block text-sm font-medium text-gray-300 mb-1">
              Certificate Name
            </label>
            <input
              type="text"
              id="certificateName"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., AWS Cloud Practitioner"
              required
            />
          </div>
          
          <div>
            <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-300 mb-1">
              Certificate File (PDF, PNG, or JPG)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="certificateFile"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              required
            />
            <p className="mt-1 text-sm text-gray-400">
              Upload a clear image or PDF of your certificate
            </p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isUploading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Certificate'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Credit Score Card */}
      <div className="bg-gray-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Credits Earned</p>
            <p className="text-white text-2xl font-bold">{creditScore}</p>
          </div>
        </div>
      </div>
      
      {/* Certificates List */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Your Certificates</h3>
        </div>
        
        {(!certificates || certificates.length === 0) ? (
          <div className="p-10 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <h3 className="text-xl text-gray-300 font-medium mb-2">No certificates uploaded</h3>
            <p className="text-gray-400">Upload your first certificate to earn credits</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {certificates.map((cert) => (
              <div key={cert._id} className={`p-5 hover:bg-gray-750 transition-colors duration-200 ${cert.isVerified ? 'bg-gray-800' : 'bg-yellow-900'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h4 className="text-white font-medium">{cert.name}</h4>
                    <p className="text-gray-400 text-sm">
                      Submitted: {formatDate(cert.submittedAt)}
                    </p>
                    {cert.verifiedAt && (
                      <p className="text-gray-400 text-sm">
                        Verified: {formatDate(cert.verifiedAt)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {cert.isVerified ? (
                      <>
                        <span className="px-3 py-1 inline-flex items-center bg-green-900 text-green-200 text-xs font-medium rounded-full mr-3">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Verified
                        </span>
                        <span className="px-3 py-1 inline-flex items-center bg-indigo-900 text-indigo-200 text-xs font-medium rounded-full mr-3">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {cert.creditsAwarded} Credits
                        </span>
                      </>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center bg-yellow-800 text-yellow-200 text-xs font-medium rounded-full mr-3">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Pending Verification
                      </span>
                    )}
                    
                    <a 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-400 hover:text-indigo-300 ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesSection; 