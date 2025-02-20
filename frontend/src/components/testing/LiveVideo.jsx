import React, { useCallback, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoChat = () => {
  const [stream, setStream] = useState(null);
  const [myId, setMyId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [role, setRole] = useState("");

  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);

  // Function to get media stream
  const getMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
      }
      return mediaStream;
    } catch (error) {
      console.error("Could not start video source:", error);
      alert("Please allow camera and microphone access.");
      return null;
    }
  };

  // Start a session (Broadcaster)
  const startSession = async () => {
    const mediaStream = await getMediaStream();
    if (mediaStream) {
      setRole("broadcaster");
      socket.emit("start-session");
    }
  };

  // Join a session (Viewer)
  const joinSession = () => {
    if (!ownerId) return alert("Enter a session ID");
    setRole("viewer");
    socket.emit("join-session", ownerId);
  };

  // Broadcaster initiates call with a viewer
  const initiateCall = useCallback((viewerId) => {
    if (!stream) return;
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { target: viewerId, signal });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
      }
    });

    peerRef.current = peer;
  },[stream]);

  // Viewer joins broadcaster's session
  const joinPeer = useCallback( async (ownerId) => {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { target: ownerId, signal });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
      }
    });

    peerRef.current = peer;
  },[]);

  

  useEffect(() => {
    socket.on("your-id", (id) => setMyId(id));

    socket.on("user-joined", (viewerId) => {
      setRemoteId(viewerId);
      initiateCall(viewerId);
    });

    socket.on("session-joined", (ownerId) => {
      joinPeer(ownerId);
    });

    socket.on("signal", ({ signal, from }) => {
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    return () => {
      socket.off("your-id");
      socket.off("user-joined");
      socket.off("session-joined");
      socket.off("signal");
    };
  }, [initiateCall,joinPeer]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Live Video Chat</h2>

      {role === "" && (
        <div>
          <button onClick={startSession}>Start Session</button>
          <button onClick={() => setRole("joining")}>Join Session</button>
        </div>
      )}

      {role === "broadcaster" && (
        <div>
          <h3>My Video (Broadcaster)</h3>
          <video ref={myVideo} autoPlay muted style={{ width: "40%" }} />
          <p>
            Session ID: <strong>{myId}</strong>
          </p>
        </div>
      )}

      {role === "joining" && (
        <div>
          <input
            type="text"
            placeholder="Enter Session ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
          />
          <button onClick={joinSession}>Join</button>
        </div>
      )}

      {role === "viewer" && (
        <div>
          <h3>Broadcaster's Video</h3>
          <video ref={remoteVideo} autoPlay style={{ width: "40%" }} />
        </div>
      )}

      {remoteId && (
        <div>
          <h3>User Joined: {remoteId}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoChat;
