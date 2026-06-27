import React, { useState, useEffect, useRef } from "react";
import {
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Send,
  Loader2,
  Users,
  MessageSquare,
  Share2,
} from "lucide-react";

export default function VideoCallUI({ chatClient, channel }) {
  const {
    useLocalParticipant,
    useRemoteParticipants,
    useMicrophoneState,
    useCameraState,
  } = useCallStateHooks();

  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const remoteParticipant = remoteParticipants[0]; // 1-on-1 call focus

  const { microphone, isMute: isMutedAudio } = useMicrophoneState();
  const { camera, isMute: isMutedVideo } = useCameraState();

  // Chat states
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const messagesEndRef = useRef(null);

  // Layout UI states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const participantCount = remoteParticipants.length + (localParticipant ? 1 : 0);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Sync initial messages and listen to new ones
  useEffect(() => {
    if (!channel) return;

    // Load initial messages
    setMessages(channel.state.messages || []);

    const handleNewMessage = (event) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.find((m) => m.id === event.message.id)) return prev;
        return [...prev, event.message];
      });
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [channel]);

  // Scroll to bottom when messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !channel) return;

    try {
      await channel.sendMessage({ text: newMessageText });
      setNewMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Top Header Bar (Unified for Right Panel) */}
      <div className="h-14 border-b border-zinc-905/70 flex items-center justify-between px-2 shrink-0 select-none pb-4">
        
        {/* Left: Participant Info & Share Link */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs">
            <Users className="w-4 h-4 text-green-500" />
            <span>
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white border border-zinc-800 text-zinc-400 font-mono text-xs px-3 py-1.5 rounded-xl transition-all active:scale-[0.97]"
          >
            <Share2 className="w-3.5 h-3.5 text-green-500" />
            <span>{copied ? "Copied Link!" : "Share URL"}</span>
          </button>
        </div>

        {/* Right: Chat Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-xl transition-all border ${
            isChatOpen
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-400"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-green-500" />
          <span>Chat</span>
        </button>
      </div>

      {/* Content Row below Header */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden mt-2">
        {/* VIDEO CONTAINER */}
        <div className="flex-1 min-h-[250px] lg:min-h-0 bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden relative flex flex-col shadow-2xl">
          
          {/* Main Participant Video View */}
          <div className="flex-1 bg-black relative overflow-hidden">
            {remoteParticipant ? (
              <div className="w-full h-full">
                <ParticipantView
                  participant={remoteParticipant}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-white font-mono text-xs">
                  {remoteParticipant.name || "Remote Partner"}
                </div>
              </div>
            ) : localParticipant ? (
              <div className="w-full h-full">
                <ParticipantView
                  participant={localParticipant}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/75 backdrop-blur-lg border border-zinc-850 px-6 py-4 rounded-2xl text-center max-w-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-green-500 mx-auto mb-2" />
                    <p className="font-mono text-sm text-zinc-300 font-bold">Waiting for participant...</p>
                    <p className="text-xs text-zinc-550 mt-1">Share the session URL with your interviewer.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            )}

            {/* Floating Local Thumbnail (Picture in Picture) */}
            {remoteParticipant && localParticipant && (
              <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-30 rounded-2xl border-2 border-zinc-800 overflow-hidden shadow-2xl bg-black">
                <ParticipantView
                  participant={localParticipant}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] text-white font-mono">
                  You
                </div>
              </div>
            )}
          </div>

          {/* Media Call Controls */}
          <div className="h-16 border-t border-zinc-900 bg-zinc-900/30 px-6 flex items-center justify-center gap-4 shrink-0 select-none">
            <button
              onClick={() => microphone.toggle()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isMutedAudio
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
              title={isMutedAudio ? "Unmute Mic" : "Mute Mic"}
            >
              {isMutedAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => camera.toggle()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isMutedVideo
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
              title={isMutedVideo ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isMutedVideo ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        {isChatOpen && (
          <div className="w-full lg:w-80 h-[350px] lg:h-full bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl shrink-0">
            {/* Chat Header */}
            <div className="h-[52px] border-b border-zinc-900 bg-zinc-900/40 px-6 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <span className="font-mono text-xs font-bold text-zinc-400">Live Chat</span>
              </div>
              <span className="text-[10px] font-mono bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded">
                Connected
              </span>
            </div>

            {/* Message Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <MessageSquare className="w-8 h-8 text-zinc-800 mb-2" />
                  <p className="font-mono text-xs text-zinc-650 font-bold">No messages yet</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Send a message to start chatting.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user.id === chatClient.userID;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {!isMe && (
                          <img
                            src={msg.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user.id}`}
                            alt={msg.user.name}
                            className="w-4 h-4 rounded-full border border-zinc-800"
                          />
                        )}
                        <span className="text-[10px] font-mono text-zinc-550 font-bold">
                          {isMe ? "You" : msg.user.name || "User"}
                        </span>
                        <span className="text-[9px] text-zinc-600 font-mono">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs font-sans break-words leading-5 ${
                          isMe
                            ? "bg-green-500 text-black font-semibold rounded-tr-none"
                            : "bg-zinc-900 border border-zinc-850 text-zinc-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-900 bg-zinc-900/10 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-900 text-zinc-150 placeholder-zinc-600 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className="bg-green-500 hover:bg-green-400 text-black p-2.5 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                onClick={handleSendMessage}
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
