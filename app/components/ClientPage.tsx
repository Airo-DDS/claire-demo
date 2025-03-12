'use client';

import dynamic from 'next/dynamic';
import { PhoneForwarded } from 'lucide-react';

// Dynamically import the VapiAssistant component with no SSR
const VapiAssistant = dynamic(() => import('./VapiAssistant'), { ssr: false });

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation bar */}
      <nav className="bg-white py-4 px-6 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <PhoneForwarded className="h-7 w-7 dental-blue-text mr-2" />
            <span className="text-xl font-bold dental-blue-text">AiroDental</span>
          </div>
          <div>
            <a href="https://airodental.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-700">Learn More</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dental-blue-text mb-3">Claire - AI Receptionist</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience our dental AI receptionist with different voice models to find the perfect match for your practice
          </p>
        </div>
        
        {/* Demo Instructions */}
        <div className="max-w-3xl mx-auto mb-10 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 dental-blue-text">How to Use This Demo</h2>
          <ol className="text-gray-600 space-y-2 ml-5 list-decimal">
            <li>Click &quot;Call Claire&quot; to start a conversation with our AI receptionist</li>
            <li>Speak naturally as if you were calling to schedule a dental appointment</li>
            <li>Try phrases like &quot;I need to book a cleaning&quot; or &quot;Do you have availability next week?&quot;</li>
            <li>Test how Claire handles questions about services, insurance, or office hours</li>
            <li>Compare the voice quality and natural responses between the two models</li>
          </ol>
        </div>
        
        {/* Voice Models Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Elevenlabs Voice Model
              </span>
            </div>
            <VapiAssistant 
              assistantId="5ddeb40e-9013-47f3-b980-2091e6b9269e"
              assistantName="Claire - Elevenlabs"
              accentColor="#1E88E5"
            />
          </div>
          
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Cartesia Voice Model
              </span>
            </div>
            <VapiAssistant 
              assistantId="53108c74-03ae-4038-9cf8-ce33f18aea11"
              assistantName="Claire - Cartesia"
              accentColor="#7E57C2"
            />
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold dental-blue-text text-center mb-8">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 dental-blue-text">Natural Conversations</h3>
              <p className="text-gray-600 text-sm">Claire understands natural language and responds conversationally to appointment requests.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 dental-blue-text">24/7 Availability</h3>
              <p className="text-gray-600 text-sm">Never miss a potential appointment with round-the-clock reception capability.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 dental-blue-text">Smart Scheduling</h3>
              <p className="text-gray-600 text-sm">Integrates with your calendar to book appointments based on real availability.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 text-sm">Powered by VAPI • AI Voice Technology</p>
          <p className="text-gray-400 text-xs mt-2">© 2025 Haloweave for AiroDental</p>
        </div>
      </footer>
    </div>
  );
}