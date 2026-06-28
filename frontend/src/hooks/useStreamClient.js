import { useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import axiosInstance from "../componets/lib/axios";
import { auth } from "../firebase/config";

export default function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let active = true;
    let localStreamVideoClient = null;
    let localStreamChatClient = null;
    let localCall = null;

    async function initStream() {
      if (loadingSession || !session || !auth.currentUser) return;

      // Only connect if host or participant
      if (!isHost && !isParticipant) return;

      setIsInitializingCall(true);

      try {
        const tokenResult = await auth.currentUser.getIdToken();
        const response = await axiosInstance.get("/api/chat/token", {
          headers: {
            Authorization: `Bearer ${tokenResult}`,
          },
        });

        const { token, apiKey, userId, userName, userImage } = response.data;

        if (!active) return;

        // 1. Stream Chat Init
        const chatClientInstance = StreamChat.getInstance(apiKey);
        localStreamChatClient = chatClientInstance;
        
        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName || auth.currentUser.displayName || "User",
            image: userImage || auth.currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
          },
          token
        );

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        if (!active) {
          await chatClientInstance.disconnectUser();
          return;
        }

        // 2. Stream Video Init
        const videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: userId,
            name: userName || auth.currentUser.displayName || "User",
            image: userImage || auth.currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
          },
          token,
        });
        localStreamVideoClient = videoClient;

        const streamCall = videoClient.call("default", session.callId);
        localCall = streamCall;
        await streamCall.join({ create: isHost });

        if (!active) {
          await streamCall.leave();
          await chatClientInstance.disconnectUser();
          return;
        }

        setStreamClient(videoClient);
        setCall(streamCall);
        setChatClient(chatClientInstance);
        setChannel(chatChannel);
        setIsInitializingCall(false);
      } catch (err) {
        console.error("Error initializing Stream client", err);
        setIsInitializingCall(false);
      }
    }

    initStream();

    return () => {
      active = false;
      setIsInitializingCall(true);
      
      const cleanUp = async () => {
        if (localCall) {
          try {
            await localCall.leave();
          } catch (e) {
            console.error("Error leaving video call:", e);
          }
        }
        if (localStreamChatClient) {
          try {
            await localStreamChatClient.disconnectUser();
          } catch (e) {
            console.error("Error disconnecting chat user:", e);
          }
        }
      };

      cleanUp();
      setStreamClient(null);
      setCall(null);
      setChatClient(null);
      setChannel(null);
    };
  }, [session?.callId, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall: isInitializingCall || (!streamClient && (isHost || isParticipant)),
  };
}
