'use client';

import dynamic from 'next/dynamic';
import { PhoneForwarded, History } from 'lucide-react';
import Link from 'next/link';

// Dynamically import the VapiAssistant component with no SSR
const VapiAssistant = dynamic(() => import('./VapiAssistant'), { ssr: false });

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Enhanced Navigation bar */}
      <nav className="bg-white py-3 px-6 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <PhoneForwarded className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-xl font-semibold text-blue-600">AiroDental</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              href="/calls" 
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <History className="h-4 w-4 mr-1.5" />
              <span>Call History</span>
            </Link>
            <a 
              href="https://airodental.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Header Section with improved typography */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Claire - AI Receptionist</h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience our dental AI receptionist with different voice models to find the perfect match for your practice
          </p>
        </div>
        
        {/* Voice Models Comparison with enhanced visual design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                Elevenlabs Voice Model
              </span>
            </div>
            <VapiAssistant 
              assistantId="5ddeb40e-9013-47f3-b980-2091e6b9269e"
              assistantName="Claire - Elevenlabs"
              accentColor="#1976D2" // Slightly darker blue for better contrast
            />
          </div>
          
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                Cartesia Voice Model
              </span>
            </div>
            <VapiAssistant 
              assistantId="53108c74-03ae-4038-9cf8-ce33f18aea11"
              assistantName="Claire - Cartesia"
              accentColor="#673AB7" // Slightly darker purple for better contrast
            />
          </div>
        </div>
      </main>
      
      {/* Footer with improved styling */}
      <footer className="py-6 px-4 border-t border-gray-100 bg-white mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 text-xs">© 2025 AiroDental</p>
        </div>
      </footer>
    </div>
  );
}