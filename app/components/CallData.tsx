'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PhoneCall, Loader2, Volume2 } from 'lucide-react';

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
                  <td className="px-4 py-3 text-sm max-w-xs">
                    {truncateText(call.transcript || 'No transcript available')}
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    {call.analysis 
                      ? truncateText(JSON.stringify(call.analysis))
                      : 'No analysis available'}
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
    </div>
  );
}