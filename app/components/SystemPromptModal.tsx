'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FileText } from "lucide-react";

interface SystemPromptModalProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function SystemPromptModal({ 
  buttonText = "View System Prompt", 
  buttonVariant = "outline" 
}: SystemPromptModalProps) {
  const [open, setOpen] = useState(false);

  // Parse and structure the system prompt content for better display
  const renderFormattedPrompt = () => {
    // The system prompt content
    const promptContent = `[Identity]
You are "Claire," an AI voice receptionist for Airodental, a reputable dental practice in Anaheim, California. The practice is located at "seventy one oh one North Dental Boulevard" and is led by Dr. Claire Johnson. Airodental offers high-quality dental services to the local community, with business hours from 8 AM to 5 PM daily (closed on Sundays).

[Style]
- Maintain an ultra-professional and courteous demeanor.
- Use concise, polite language with minimal filler words.
- Provide short and precise responses.
- Avoid sounding overly excited or informal.

[Response Guidelines]
- If asked for the address, always include the phrase "seventy one oh one" followed by the full address.
- Spell out or naturally read numbers where appropriate to sound less robotic.
- If unsure or if the question is unclear, politely ask clarifying questions.
- Do not reference or reveal any internal functions, APIs, or tools by name.

[Task & Goals]
1. Offer business information: address, hours, and services.
2. Schedule appointments upon request.
   a. Ask the caller's full name.
   b. Ask the purpose of their appointment.
   c. Inquire about their preferred date and time.
   d. Confirm all details clearly: name, date, time, and reason.
3. Keep responses succinct but clear. Never over-embellish or add unnecessary information.
4. Maintain a smooth conversational flow without abruptly switching topics.

[Error Handling]
- If the caller's request is ambiguous, ask specific clarifying questions.
- In the event of repeated confusion, politely restate the information or re-ask for necessary details.

[Example Interaction Flow]
1. Caller: "What's your address?"
   - You: "We're located at seventy one oh one North Dental Boulevard, Anaheim, California."
2. Caller: "Can I schedule an appointment tomorrow?"
   - You: "Certainly. May I have your full name?"
   - (Wait for response.)
   - "What will be the purpose of your visit?"
   - (Wait for response.)
   - "Understood. Do you have a preferred time tomorrow?"
   - (Wait for response.)
   - "I've noted your appointment for [date/time]. I will confirm with Dr. Johnson's office and let you know if there are any changes."

[Professionalism Reminder]
- Remain calm and respectful at all times.
- Avoid humor or overly casual remarks.
- Keep the conversation focused on assisting the caller with their inquiry.`;

    // Parse sections and add formatting
    const sections = promptContent.split(/\[([^\]]+)\]/g);
    
    if (sections.length <= 1) {
      return <pre className="text-sm whitespace-pre-wrap text-slate-700 font-mono">{promptContent}</pre>;
    }
    
    const formattedSections = [];
    
    // Skip the empty first element if split resulted in an empty string
    const startIdx = sections[0].trim() === "" ? 1 : 0;
    
    for (let i = startIdx; i < sections.length; i += 2) {
      const title = i + 1 < sections.length ? sections[i] : "";
      const content = i + 2 < sections.length ? sections[i + 1] : sections[i];
      
      if (title) {
        formattedSections.push(
          <div key={`section-${i}`} className="mb-6 last:mb-0">
            <h3 className="text-blue-700 font-semibold text-md mb-2">[{title}]</h3>
            <div className="pl-4 text-slate-700 whitespace-pre-wrap font-mono">
              {content.split('\n').map((line, index) => {
                if (line.trim().startsWith('-')) {
                  return (
                    <div key={`line-${index}`} className="flex items-start mb-1">
                      <span className="inline-block w-4 shrink-0">-</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                } else if (line.trim().match(/^\d+\./)) {
                  return (
                    <div key={`line-${index}`} className="flex items-start mb-1">
                      <span className="inline-block w-6 shrink-0">{line.match(/^\d+\./)?.[0]}</span>
                      <span>{line.replace(/^\d+\./, '').trim()}</span>
                    </div>
                  );
                } else if (line.trim().match(/^\s*[a-z]\./) && line.trim().length > 3) {
                  return (
                    <div key={`line-${index}`} className="flex items-start mb-1 pl-6">
                      <span className="inline-block w-6 shrink-0">{line.match(/^\s*[a-z]\./)?.[0]}</span>
                      <span>{line.replace(/^\s*[a-z]\./, '').trim()}</span>
                    </div>
                  );
                } else if (line.trim().startsWith('-')) {
                  return (
                    <div key={`line-${index}`} className="flex items-start mb-1 pl-8">
                      <span className="inline-block w-4 shrink-0">-</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                } else {
                  return <div key={`line-${index}`}>{line}</div>;
                }
              })}
            </div>
          </div>
        );
      }
    }
    
    return <div className="text-sm">{formattedSections}</div>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size="sm" 
          className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition-colors"
        >
          <FileText className="h-4 w-4 mr-1" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            System Prompt
          </DialogTitle>
          <DialogDescription>
            This is the current system prompt used to configure Claire's behavior.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 rounded-md border border-slate-200 my-2 max-h-[65vh] overflow-y-auto">
          <div className="p-5">
            {renderFormattedPrompt()}
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            onClick={() => setOpen(false)} 
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}