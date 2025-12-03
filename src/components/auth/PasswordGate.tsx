"use client";

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const CORRECT_PASSWORD = 'CreativeCOEAPAC';
const STORAGE_KEY = 'cbre-bc-auth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg viewBox="0 0 81 20.13" className="h-10 fill-[#003F2D]" xmlns="http://www.w3.org/2000/svg">
              <path d="M33.57,15.41H26.89V12.05h6.86a1.66,1.66,0,0,1,1.49,1.64,1.73,1.73,0,0,1-1.67,1.72m-6.68-11h7A1.64,1.64,0,0,1,35.3,6a1.72,1.72,0,0,1-1.43,1.68h-7Zm9.94,5.37c2.56-.85,3-3,3-4.75,0-2.68-1.89-5-7.48-5H21.94V20.09h10.4C38,20.09,40,17.21,40,14.32a4.91,4.91,0,0,0-3.19-4.58M63.37,0V20.13H81V15.54H68.28V12H79.75V7.63H68.28V4.39H81V0ZM55.79,6.26a1.65,1.65,0,0,1-1.57,1.38H47.34V4.43h6.88a1.57,1.57,0,0,1,1.57,1.4ZM53.12,0H42.47v20.1h4.89V12h5.39a2.8,2.8,0,0,1,2.74,2.85v5.27h4.79V13.62a4.21,4.21,0,0,0-2.9-3.89,4.5,4.5,0,0,0,3-4.44C60.34.94,56.6,0,53.12,0M18.76,15.27c-.07,0-6.69.13-9-.09a5.16,5.16,0,0,1-5-5.31,5.14,5.14,0,0,1,4.82-5.2c1.39-.19,9-.1,9.09-.1h.16L18.9,0h-.16L10.11,0A12.73,12.73,0,0,0,5.93.84,10.25,10.25,0,0,0,2,4a10,10,0,0,0-2,6,12.15,12.15,0,0,0,.16,2A9.8,9.8,0,0,0,5.65,19a14.72,14.72,0,0,0,5.46,1.11l1.63,0h6.17V15.27Z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-financier text-gray-900 text-center mb-2">
            Access Required
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            This tool is for internal CBRE use only.<br />
            Please enter the access password to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F2D] focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#003F2D] text-white py-3 rounded-md font-medium hover:bg-[#002a1e] transition-colors"
            >
              Access Site
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-600">Business Card Generator</p>
            <p>Access will be granted for 24 hours</p>
            <p className="mt-4">
              Need access?{' '}
              <a 
                href="mailto:rizki.novianto@cbre.com" 
                className="text-[#003F2D] hover:underline"
              >
                Contact Administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  return <>{children}</>;
}

