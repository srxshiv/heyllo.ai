"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";
import { interviewer } from "@/constants";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    toast.info("Bonus: Sit in a quiet environment for better call reception", {
      duration: 8000,
      description: "Background noise might disturb the call.",
    });

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Error in VAPI call:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    try {
      const response = await fetch("/api/feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
        }),
      });

      const result = await response.json();
      if (result.success && result.feedbackId) {
        router.push(`/interview/${interviewId}/feedback/`);
      } else {
        console.error("Failed to generate feedback:", result.error);
        router.push(`/`);
      }
    } catch (error) {
      console.error("Error calling feedback API:", error);
      router.push(`/`);
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push(`/`);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, userId, type]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        await vapi.start(undefined, undefined, undefined, process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: { username: userName, userid: userId },
        });
      } else {
        let formattedQuestions = questions?.map((q) => `- ${q}`).join("\n") || "";
        await vapi.start(interviewer, {
          variableValues: { username: userName, userid: userId, questions: formattedQuestions }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Interview Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${
              callStatus === CallStatus.ACTIVE ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`} />
            <span className="text-sm text-gray-600">
              {callStatus === CallStatus.ACTIVE ? 'Live' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interview Area */}
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participant Cards (Left Sidebar) */}
        <div className="lg:col-span-1 space-y-4">
          {/* AI Interviewer Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Image
                  src="/ai-avatar.png"
                  alt="AI Interviewer"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-indigo-100"
                />
                {isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-800">AI Interviewer</h3>
              <p className="text-sm text-gray-500">Virtual Interview Bot</p>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <Image
                src="/user-avatar.png"
                alt={userName}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-indigo-100 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-800">{userName}</h3>
              <p className="text-sm text-gray-500">Candidate</p>
            </div>
          </div>
        </div>

        {/* Conversation Panel (Main Content) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            {messages.length > 0 ? (
              <div 
                ref={messagesContainerRef}
                className="space-y-4 h-[400px] overflow-y-auto"
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">
                  Ready to begin your interview
                </h3>
                <p>
                  Click the start button below to begin your {type === "generate" ? "general" : "role-specific"} interview
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-center">
              {callStatus !== CallStatus.ACTIVE ? (
                <button
                  onClick={handleCall}
                  disabled={callStatus === CallStatus.CONNECTING}
                  className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${
                    callStatus === CallStatus.CONNECTING
                      ? 'bg-indigo-400 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } transition-all shadow-md`}
                >
                  {callStatus === CallStatus.CONNECTING ? (
                    <>
                      <span className="animate-spin">↻</span>
                      Connecting...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="px-6 py-3 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-all shadow-md flex items-center gap-2"
                >
                  <span>✕</span>
                  End Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Agent };