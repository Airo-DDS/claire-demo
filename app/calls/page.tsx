'use client';

import CallData from '../components/CallData';

export default function CallsPage() {
  // Assistant IDs for both voice models
  const assistantIds = [
    "5ddeb40e-9013-47f3-b980-2091e6b9269e", // Claire - Elevenlabs
    "53108c74-03ae-4038-9cf8-ce33f18aea11"  // Claire - Cartesia
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation bar */}
      <nav className="bg-white py-4 px-6 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold dental-blue-text">AiroDental</span>
          </div>
          <div>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">Back to Demo</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dental-blue-text mb-3">Call History</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            View recent call data and recordings from Claire AI voice receptionist
          </p>
        </div>
        
        {/* Call Data Component */}
        <div className="max-w-6xl mx-auto">
          <CallData assistantIds={assistantIds} limit={5} />
        </div>
      </main>
      
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-xs mt-2">© 2025 AiroDental</p>
        </div>
      </footer>
    </div>
  );
}