import React, { useState, useEffect } from 'react';

type PendingCertificate = {
  userId: string;
  userName: string;
  userEmail: string;
  certificateId: string;
  certificateName: string;
  submittedAt: string;
  url: string;
};

const CertificateVerification: React.FC = () => {
  const [pendingCertificates, setPendingCertificates] = useState<PendingCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [creditsToAward, setCreditsToAward] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPendingCertificates();
  }, []);

  const fetchPendingCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/certificates/pending');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pending certificates');
      }
      
      const data = await response.json();
      setPendingCertificates(data.pendingCertificates || []);
    } catch (err) {
      console.error('Error fetching pending certificates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending certificates');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVerify = async (cert: PendingCertificate) => {
    const credits = creditsToAward[cert.certificateId];
    
    if (!credits || isNaN(parseInt(credits)) || parseInt(credits) < 0) {
      setError(`Please enter a valid number of credits for ${cert.certificateName}`);
      return;
    }
    
    try {
      setProcessing(cert.certificateId);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: cert.userId,
          certificateId: cert.certificateId,
          creditsAwarded: credits
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify certificate');
      }
      
      const data = await response.json();
      
      // Remove verified certificate from list
      setPendingCertificates(prev => 
        prev.filter(c => c.certificateId !== cert.certificateId)
      );
      
      setSuccess(`Certificate ${cert.certificateName} verified successfully. ${credits} credits awarded to ${cert.userName}.`);
      
      // Clean up the credits awarded state
      const newCreditsToAward = { ...creditsToAward };
      delete newCreditsToAward[cert.certificateId];
      setCreditsToAward(newCreditsToAward);
      
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 border-l-4 border-red-500 text-red-100 rounded mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">Certificate Verification</h2>
        <p className="text-gray-400 mt-1">Verify user certificates and award credits</p>
      </div>

      {success && (
        <div className="mx-6 mt-6 p-4 bg-green-900 border-l-4 border-green-500 text-green-100 rounded">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {pendingCertificates.length === 0 ? (
        <div className="p-6 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <h3 className="text-xl text-gray-300 font-medium mb-2">No pending certificates</h3>
          <p className="text-gray-400">All certificates have been verified</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {pendingCertificates.map((cert) => (
              <div key={cert.certificateId} className="bg-gray-800 rounded-lg p-6 shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Certificate Info */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-3">{cert.certificateName}</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span className="text-gray-300">{cert.userName}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-gray-300">{cert.userEmail}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-gray-300">Submitted: {formatDate(cert.submittedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Certificate
                      </a>
                    </div>
                  </div>

                  {/* Right: Verification Form */}
                  <div className="lg:border-l lg:border-gray-700 lg:pl-6">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleVerify(cert);
                    }}>
                      <div className="mb-4">
                        <label htmlFor={`credits-${cert.certificateId}`} className="block text-sm font-medium text-gray-300 mb-1">
                          Credits to Award
                        </label>
                        <input
                          type="number"
                          id={`credits-${cert.certificateId}`}
                          min="0"
                          value={creditsToAward[cert.certificateId] || ''}
                          onChange={(e) => setCreditsToAward({
                            ...creditsToAward,
                            [cert.certificateId]: e.target.value
                          })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter credits"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={processing === cert.certificateId}
                        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          processing === cert.certificateId ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {processing === cert.certificateId ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          'Verify & Award Credits'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerification; 