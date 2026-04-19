import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore.js";
import PageLoader from "../components/PageLoader.jsx";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const { authUser, getToken } = useAuthStore();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const hasInitializedRef = useRef(false);

  const {
    data: token,
    isLoading,
    isError,
    refetch: refetchToken,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getToken,
    enabled: !!authUser,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!authUser || authUser.plan !== 'pro') { 
      toast.error('Pro Feature Only!'); 
      navigate('/pricing'); 
      return; 
    }
    if ( !token || hasInitializedRef.current) return;

    let mounted = true;
    let videoClient;
    let callInstance;

    const initCall = async () => {
      try {
        hasInitializedRef.current = true;

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        videoClient = StreamVideoClient.getOrCreateInstance({
          apiKey: STREAM_API_KEY,
          user,
          token,
          options: {
            reconnect: true,
          },
        });

        callInstance = videoClient.call("default", callId);


        if (
          callInstance.state.callingState !== CallingState.JOINED &&
          callInstance.state.callingState !== CallingState.JOINING
        ) {
          await callInstance.join({ create: true });
        }

        if (mounted) {
          setClient(videoClient);
          setCall(callInstance);
          toast.success("Connected to call");
        }
      } catch (error) {
        console.error("Join error:", error);
        setConnectionError("Failed to join call");
        toast.error("Could not join call");
      }
    };

    initCall();

    return () => {
      mounted = false;

      if (callInstance) {
        callInstance.leave().catch(() => {});
      }

      if (videoClient) {
        videoClient.disconnectUser().catch(() => {});
      }

      hasInitializedRef.current = false;
    };
  }, [authUser, token, callId, navigate]);

  if (authUser?.plan !== 'pro') {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-black text-white'>
        <h1 className="text-3xl font-bold mb-4 text-purple-400">Pro Feature Only</h1>
        <button onClick={() => navigate('/pricing')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition">
          Upgrade Now
        </button>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to fetch Stream token.</p>
        <button
          onClick={() => refetchToken()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{connectionError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }

    if (callingState === CallingState.RECONNECTING) {
      toast.loading("Reconnecting...", { id: "reconnect" });
    }

    if (callingState === CallingState.JOINED) {
      toast.success("Connected", { id: "reconnect" });
    }

    if (callingState === CallingState.OFFLINE) {
      toast.error("You are offline", { id: "reconnect" });
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => navigate("/")} />
    </StreamTheme>
  );
};

export default CallPage;