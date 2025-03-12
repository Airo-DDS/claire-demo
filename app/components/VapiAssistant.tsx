'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { PhoneCall, PhoneOff, Volume2, Mic, MicOff, MessageSquare } from 'lucide-react';
import SystemPromptModal from './SystemPromptModal';

interface VapiAssistantProps {
  assistantId: string;
  assistantName: string;
  accentColor: string;
}

export default function VapiAssistant({ assistantId, assistantName, accentColor }: VapiAssistantProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callStatus, setCallStatus] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const vapiRef = useRef<any>(null);
  const [lastMessage, setLastMessage] = useState('');
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize VAPI only on client side
    if (typeof window !== 'undefined') {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
      vapiRef.current = vapi;

      // Set up event listeners
      vapi.on('call-start', () => {
        console.log('Call started');
        setIsCalling(true);
        setIsConnecting(false);
        setCallStatus('Connected');
      });

      vapi.on('call-end', () => {
        console.log('Call ended');
        setIsCalling(false);
        setIsConnecting(false);
        setVolumeLevel(0);
        setCallStatus('');
      });

      vapi.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapi.on('speech-start', () => {
        setCallStatus('Speaking');
      });

      vapi.on('speech-end', () => {
        setCallStatus('Listening');
      });

      vapi.on('message', (message: any) => {
        console.log('Message received:', message);
        if (message.type === 'transcript' && message.transcript?.text) {
          setLastMessage(message.transcript.text);
        }
      });

      vapi.on('error', (error: any) => {
        console.error('VAPI error:', error);
        setIsCalling(false);
        setIsConnecting(false);
        setCallStatus('Error: ' + error.message);
      });

      return () => {
        // Cleanup on unmount
        if (vapi) {
          try {
            vapi.stop();
          } catch (e) {
            console.error('Error stopping call on unmount:', e);
          }
        }
        
        // Clear any pending safety timeout
        const timeoutId = safetyTimeoutRef.current;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, []); // No dependencies to prevent recreation during component lifecycle

  const startCall = async () => {
    if (vapiRef.current && !isCalling && !isConnecting) {
      try {
        setIsConnecting(true);
        setCallStatus('Connecting...');
        await vapiRef.current.start(assistantId);
      } catch (error) {
        console.error('Failed to start call:', error);
        setIsConnecting(false);
        setCallStatus('Connection failed');
      }
    }
  };

  const stopCall = () => {
    if (vapiRef.current) {
      console.log('Stopping call...');
      
      // Immediately reset UI states to prevent showing "Listening"
      setCallStatus('');  // Clear this first to ensure "Listening" disappears
      setIsCalling(false);
      setIsConnecting(false);
      setVolumeLevel(0);
      setLastMessage('');
      
      try {
        // Then stop the Vapi call
        vapiRef.current.stop();
        
        // Clear any existing timeout
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
        }
        
        // Completely disconnect and recreate the Vapi instance to ensure clean state
        if (typeof window !== 'undefined') {
          // Create a new Vapi instance
          setTimeout(() => {
            const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
            vapiRef.current = vapi;
            
            // Set up all event listeners again
            vapi.on('call-start', () => {
              console.log('Call started');
              setIsCalling(true);
              setIsConnecting(false);
              setCallStatus('Connected');
            });

            vapi.on('call-end', () => {
              console.log('Call ended');
              setIsCalling(false);
              setIsConnecting(false);
              setVolumeLevel(0);
              setCallStatus('');
            });

            vapi.on('volume-level', (volume: number) => {
              setVolumeLevel(volume);
            });

            vapi.on('speech-start', () => {
              setCallStatus('Speaking');
            });

            vapi.on('speech-end', () => {
              setCallStatus('Listening');
            });

            vapi.on('message', (message: any) => {
              console.log('Message received:', message);
              if (message.type === 'transcript' && message.transcript?.text) {
                setLastMessage(message.transcript.text);
              }
            });

            vapi.on('error', (error: any) => {
              console.error('VAPI error:', error);
              setIsCalling(false);
              setIsConnecting(false);
              setCallStatus('Error: ' + error.message);
            });
          }, 100); // Small delay to ensure previous instance is fully cleaned up
        }
      } catch (error) {
        console.error('Error stopping call:', error);
        // Force UI to reset if there's an error
        setIsCalling(false);
        setIsConnecting(false);
        setVolumeLevel(0);
        setCallStatus('');
      }
    }
  };

  const toggleMute = () => {
    if (vapiRef.current && isCalling) {
      const newMuteState = !isMuted;
      vapiRef.current.setMuted(newMuteState);
      setIsMuted(newMuteState);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div 
        className="py-4 px-6 text-white flex justify-between items-center" 
        style={{ backgroundColor: accentColor }}
      >
        <h2 className="text-xl font-semibold">{assistantName}</h2>
        <div>
          <SystemPromptModal buttonVariant="secondary" buttonText="System Prompt" />
        </div>
      </div>
      
      <div className="p-6">
        {/* Status indicator */}
        <div className="flex items-center mb-5">
          <div className={`w-3 h-3 rounded-full mr-2 ${isCalling ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600 font-medium">{callStatus || (isCalling ? 'Active' : 'Ready')}</span>
        </div>
        
        {/* Volume visualizer with improved styling */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Volume2 className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">Volume Level</span>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-100 rounded-full h-3 mr-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-75 ease-in-out"
                style={{ 
                  width: `${Math.min(volumeLevel * 100, 100)}%`,
                  backgroundColor: accentColor
                }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-500 min-w-12 text-right">
              {Math.round(volumeLevel * 100)}%
            </span>
          </div>
        </div>

        {/* Last message display */}
        {lastMessage && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start">
              <MessageSquare className="h-4 w-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-600 italic">{lastMessage}</p>
            </div>
          </div>
        )}
        
        {/* Call controls with improved styling */}
        <div className="flex justify-center space-x-4">
          {!isCalling ? (
            <button
              onClick={startCall}
              disabled={isConnecting}
              className={`flex items-center justify-center px-5 py-2.5 text-white rounded-md transition-colors ${
                isConnecting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : `bg-green-500 hover:bg-green-600 shadow-sm`
              }`}
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              {isConnecting ? 'Connecting...' : 'Call Claire'}
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`flex items-center justify-center px-4 py-2.5 text-white rounded-md transition-colors shadow-sm ${
                  isMuted 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Mute
                  </>
                )}
              </button>
              <button
                onClick={stopCall}
                className="flex items-center justify-center px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm"
              >
                <PhoneOff className="mr-2 h-5 w-5" />
                End Call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}