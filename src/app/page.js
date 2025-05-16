"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    
    const checkAuth = () => {
      if (typeof document === 'undefined') return false;
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
      return !!accessTokenCookie;
    };

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/drive/files');
        if (response.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setFiles(data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to fetch files:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (checkAuth()) {
      fetchFiles();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
  }, [darkMode]);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-600'} mb-3`}></div>
          <p className="text-base sm:text-lg">Loading your Google Drive files...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h1 className={`text-2xl sm:text-3xl font-bold text-center sm:text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Google Drive Files</h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full self-center sm:self-auto ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> )}
            </button>
          </div>
          <div className={`${darkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-4 sm:px-6 sm:py-4 rounded-lg border`}>
            <p className="font-medium mb-2 text-sm sm:text-base">Error loading files: {error}</p>
            <p className="text-sm sm:text-base">Please try again or check your authentication status.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Not Authenticated State ---
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="p-4 sm:p-8 mx-auto text-center">
          <div className="flex justify-end mb-4 sm:mb-6">
             <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> )}
            </button>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 md:p-10 rounded-xl shadow-lg max-w-md sm:max-w-xl mx-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <image src="/api/placeholder/100/100" alt="Google Drive" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"/>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Google Drive File Manager</h1>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Connect to your Google Drive to access and download your files.</p>
            <button onClick={handleLogin} className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center mx-auto transition-colors font-medium text-sm sm:text-base">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
              Connect to Google Drive
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated State - File List ---
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="p-4 sm:p-6 md:p-8 max-w-full sm:max-w-5xl mx-auto">
        <div className="flex flex-col text-center sm:text-left sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Google Drive Files</h1>
          <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> )}
            </button>
            <button onClick={handleLogin} className={`px-3 py-1.5 sm:px-4 sm:py-2 flex items-center font-medium rounded-md transition-colors text-sm sm:text-base ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              <svg className="w-4 h-4 mr-1 sm:mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
              Refresh Access
            </button>
          </div>
        </div>
        
        {files.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-yellow-50 border-yellow-100 text-yellow-800'} rounded-lg p-4 sm:p-6 border`}>
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
              <svg className="w-6 h-6 mb-2 sm:mb-0 sm:mr-3 text-yellow-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <p className="text-sm sm:text-base">No files found in your Google Drive or you don&apos;t have access to any files.</p>
            </div>
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md overflow-hidden border`}>
            <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {files.map(file => (
                <li key={file.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-3">
                    {/* File Info (Icon + Name) */}
                    <div className="flex items-center flex-grow min-w-0"> {/* min-w-0 is crucial for truncate */}
                      <FileIcon mimeType={file.mimeType} darkMode={darkMode} />
                      <span className={`ml-2 sm:ml-3 font-medium truncate ${
                        file.mimeType && file.mimeType.includes('folder') 
                        ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') 
                        : (darkMode ? 'text-white' : 'text-gray-800')
                      }`}>
                        {file.name}
                      </span>
                    </div>

                    {/* Action Area (Download Icon or Placeholder) */}
                    <div className="flex-shrink-0 w-[36px] h-[36px] flex items-center justify-center">
                      {file.mimeType && !file.mimeType.includes('folder') && (
                        <a
                          href={`https://drive.google.com/uc?export=download&id=${file.id}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Download ${file.name}`}
                          title={`Download ${file.name}`}
                          className={`p-2 rounded-full transition-colors ${
                            darkMode
                              ? 'text-green-400 hover:bg-gray-700' 
                              : 'text-green-600 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function FileIcon({ mimeType, darkMode }) {
  let iconPath;
  let colorClass;
  
  if (!mimeType) return (
    <div className={`flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md p-2`}>
      <svg 
        className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    </div>
  );
  
  if (mimeType.includes('folder')) {
    iconPath = 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z';
    colorClass = darkMode ? 'text-yellow-400' : 'text-yellow-500';
  } else if (mimeType.includes('spreadsheet') || mimeType.includes('application/vnd.google-apps.spreadsheet')) {
    iconPath = 'M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 2h12v2H6V5zm0 4h4v2H6V9zm0 4h4v2H6v-2zm6 0h6v2h-6v-2zm6-4h-6v2h6V9z';
    colorClass = darkMode ? 'text-green-400' : 'text-green-600';
  } else if (mimeType.includes('document') || mimeType.includes('application/vnd.google-apps.document') || mimeType.includes('application/msword') || mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    iconPath = 'M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z';
    colorClass = darkMode ? 'text-blue-400' : 'text-blue-600';
  } else if (mimeType.includes('presentation') || mimeType.includes('application/vnd.google-apps.presentation') || mimeType.includes('application/vnd.ms-powerpoint') || mimeType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
    iconPath = 'M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 2h12v10H6V5zm2 2v6h8V7H8z';
    colorClass = darkMode ? 'text-orange-400' : 'text-orange-600';
  } else if (mimeType.includes('pdf')) {
    iconPath = 'M18 10H6V8h12v2zm0 4H6v-2h12v2zm-6 4h-2v-2H8V6h8v8h-2v2zm4-16H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V6l-6-6z';
    colorClass = darkMode ? 'text-red-400' : 'text-red-600';
  } else if (mimeType.includes('image')) {
    iconPath = 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    colorClass = darkMode ? 'text-purple-400' : 'text-purple-600';
  } else if (mimeType.includes('audio') || mimeType.includes('mp3') || mimeType.includes('mp4') || mimeType.includes('video')) {
    iconPath = 'M3 3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2H3zm5 4l8 5-8 5V7z';
    colorClass = darkMode ? 'text-indigo-400' : 'text-indigo-600';
  } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('compressed')) {
    iconPath = 'M10 4H6V2H4v2H2v2h2v12h2V6h4V4zm4 0V2h-2v2h-2v2h2v12h2V6h2V4h-2zm0 14v2h2v-2h2v-2h-2V6h-2v10z';
    colorClass = darkMode ? 'text-amber-400' : 'text-amber-600';
  } else {
    iconPath = 'M9 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V8l-6-6H9zM8 4h4v4h4v8H8V4z';
    colorClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  }

  return (
    <div className={`flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md p-1.5 sm:p-2`}>
      <svg 
        className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClass}`} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
      </svg>
    </div>
  );
}