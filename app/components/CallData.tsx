'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, Loader2, Volume2, X, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Call {
  id: string;
  assistantId: string;
  transcript: string;
  analysis: any;
  recordingUrl: string;
  createdAt: string;
}

interface CallDataProps {
  assistantIds: string[];
  limit?: number;
}

export default function CallData({ assistantIds, limit = 3 }: CallDataProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    type: 'transcript' | 'analysis';
    content: any;
    title: string;
  }>({
    isOpen: false,
    type: 'transcript',
    content: null,
    title: '',
  });

  // Function to fetch call data for a specific assistant
  const fetchCallsForAssistant = async (assistantId: string) => {
    try {
      const res = await fetch(`/api/get-assistant-calls?assistantId=${assistantId}&limit=${limit}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.calls || [];
    } catch (e: any) {
      console.error(`Error fetching calls for assistant ${assistantId}:`, e);
      throw e;
    }
  };

  // Function to load data for all assistants
  const loadCallData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch calls for all assistants in parallel
      const callPromises = assistantIds.map(id => fetchCallsForAssistant(id));
      const results = await Promise.all(callPromises);
      
      // Combine and sort all calls by creation date
      const allCalls = results.flat();
      allCalls.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setCalls(allCalls);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Play or pause audio
  const toggleAudio = (url: string) => {
    if (activeAudio === url) {
      // Pause current audio
      const audioElement = document.getElementById('call-audio') as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
      setActiveAudio(null);
    } else {
      // Play new audio
      setActiveAudio(url);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Truncate text to a certain length
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Open modal with transcript or analysis
  const openModal = (type: 'transcript' | 'analysis', content: any, title: string) => {
    setModalContent({
      isOpen: true,
      type,
      content,
      title,
    });
  };
  
  // Close the modal
  const closeModal = () => {
    setModalContent(prev => ({ ...prev, isOpen: false }));
  };
  
  // Format transcript for better readability
  const formatTranscript = (transcript: string) => {
    if (!transcript) return "No transcript available";
    
    // Try to detect if the transcript has a conversation format
    // Look for patterns like "User:" or "Claire:" or "AI:" or similar indicators
    const hasConversationFormat = /(\b(User|Caller|Claire|Assistant|AI)\s*:)/i.test(transcript);
    
    if (hasConversationFormat) {
      // Split by common speaker patterns
      const segments = transcript.split(/(\b(?:User|Caller|Claire|Assistant|AI)\s*:)/i);
      const formattedSegments = [];
      
      for (let i = 1; i < segments.length; i += 2) {
        const speaker = segments[i].trim();
        const text = i+1 < segments.length ? segments[i+1] : "";
        
        formattedSegments.push(
          <div key={i} className="mb-4">
            <span className={`font-semibold ${speaker.toLowerCase().includes('claire') || speaker.toLowerCase().includes('assistant') || speaker.toLowerCase().includes('ai') ? 'text-blue-600' : 'text-green-600'}`}>
              {speaker}
            </span>
            <p className="ml-6 text-gray-700 mt-1">{text.trim()}</p>
          </div>
        );
      }
      
      return (
        <div className="space-y-1">
          {formattedSegments.length > 0 ? formattedSegments : <p className="text-gray-700">{transcript}</p>}
        </div>
      );
    } else {
      // If no conversation format detected, try to break by lines or paragraphs
      const paragraphs = transcript.split(/\n{2,}/g).filter(p => p.trim());
      
      if (paragraphs.length > 1) {
        return (
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700">{paragraph}</p>
            ))}
          </div>
        );
      } else {
        // Just split by newlines
        const lines = transcript.split('\n').filter(line => line.trim());
        return (
          <div className="space-y-2">
            {lines.map((line, index) => (
              <p key={index} className="text-gray-700">{line}</p>
            ))}
          </div>
        );
      }
    }
  };
  
  // Format analysis JSON for better readability
  const formatAnalysis = (analysis: any) => {
    if (!analysis) return "No analysis available";
    
    try {
      // If analysis is a string (already JSON), parse it
      const parsedAnalysis = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
      
      // Check if the analysis has specific fields we want to highlight
      const hasStructuredFields = parsedAnalysis && 
        (parsedAnalysis.summary || parsedAnalysis.intent || 
         parsedAnalysis.appointment || parsedAnalysis.caller);
      
      if (hasStructuredFields) {
        return (
          <div className="space-y-6">
            {parsedAnalysis.summary && (
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Summary</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-md">{parsedAnalysis.summary}</p>
              </div>
            )}
            
            {parsedAnalysis.intent && (
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Intent</h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-md">{parsedAnalysis.intent}</p>
              </div>
            )}
            
            {parsedAnalysis.appointment && (
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Appointment Details</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  {Object.entries(parsedAnalysis.appointment).map(([key, value]) => (
                    <div key={key} className="flex py-1 border-b border-blue-100 last:border-0">
                      <span className="font-medium text-gray-700 w-1/3">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {parsedAnalysis.caller && (
              <div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Caller Information</h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  {Object.entries(parsedAnalysis.caller).map(([key, value]) => (
                    <div key={key} className="flex py-1 border-b border-blue-100 last:border-0">
                      <span className="font-medium text-gray-700 w-1/3">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        // Just show a simple formatted JSON if no structured fields
        const formattedJson = JSON.stringify(parsedAnalysis, null, 2);
        return (
          <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono text-gray-700 max-h-[60vh] overflow-y-auto border border-gray-200">
            {formattedJson}
          </pre>
        );
      }
    } catch (e) {
      return <p className="text-red-600">Error formatting analysis data: {String(e)}</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dental-blue-text">Recent Call Data</h2>
        <Button 
          onClick={loadCallData} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PhoneCall className="h-4 w-4" />
          )}
          {loading ? 'Loading...' : 'Load Call Data'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Hidden audio element for playing recordings */}
      {activeAudio && (
        <audio 
          id="call-audio" 
          src={activeAudio} 
          autoPlay 
          controls 
          className="hidden"
          onEnded={() => setActiveAudio(null)}
        />
      )}

      {calls.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {loading ? 'Loading call data...' : 'No call data available. Click "Load Call Data" to fetch recent calls.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="mb-3 text-sm text-gray-500 italic">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click on transcript or analysis text to view the full content
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Call ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Assistant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Transcript</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Analysis</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Audio</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{call.id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm">{formatDate(call.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    {call.assistantId === "5ddeb40e-9013-47f3-b980-2091e6b9269e" 
                      ? "Claire - Elevenlabs" 
                      : "Claire - Cartesia"}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm max-w-xs cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openModal('transcript', call.transcript, 'Call Transcript')}
                  >
                    <div className="flex items-center">
                      <span className="truncate">{truncateText(call.transcript || 'No transcript available')}</span>
                      <span className="text-xs text-blue-500 ml-1">[View]</span>
                    </div>
                  </td>
                  <td 
                    className="px-4 py-3 text-sm max-w-xs cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => openModal('analysis', call.analysis, 'Call Analysis')}
                  >
                    <div className="flex items-center">
                      <span className="truncate">
                        {call.analysis 
                          ? truncateText(JSON.stringify(call.analysis))
                          : 'No analysis available'}
                      </span>
                      {call.analysis && <span className="text-xs text-blue-500 ml-1">[View]</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {call.recordingUrl ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleAudio(call.recordingUrl)}
                        className={activeAudio === call.recordingUrl ? "bg-blue-50" : ""}
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        {activeAudio === call.recordingUrl ? 'Stop' : 'Play'}
                      </Button>
                    ) : (
                      'No recording'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal for displaying full transcript or analysis */}
      <Dialog open={modalContent.isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="flex items-center">
              <div className="flex items-center">
                {modalContent.type === 'transcript' ? (
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M13 8H7"></path>
                    <path d="M17 12H7"></path>
                  </svg>
                )}
                <span className="text-blue-700">{modalContent.title}</span>
              </div>
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {modalContent.type === 'transcript' 
              ? formatTranscript(modalContent.content) 
              : formatAnalysis(modalContent.content)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}