import { useEffect, useState } from "react";
import "./App.css";
import useControls from "./hooks/useControls";
import { useWebSocket } from "./hooks/useWebSocket";
import KeyboardControls from "./components/KeyboardControls";
import "./components/KeyboardControls.css";

function App() {
  const [url, setUrl] = useState("");
  const [urlText, setUrlText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    forward,
    backward,
    left,
    right,
    up,
    down,
    simulateKeyPress,
    simulateKeyRelease,
  } = useControls();
  const { sendMessage, isConnected, addMessageListener } = useWebSocket({
    url,
  });

  const connect = () => {
    if (urlText) {
      setUrl(urlText);
    }
  };

  useEffect(() => {
    if (isConnected) {
      addMessageListener((message) => {
        // Handle binary image data
        if (message.data instanceof Blob) {
          const url = URL.createObjectURL(message.data);
          setImageUrl(url);
          // Clean up the previous URL to prevent memory leaks
          return () => URL.revokeObjectURL(url);
        }
      });
    }
  }, [isConnected, addMessageListener]);

  // Send state immediately when controls change
  useEffect(() => {
    if (isConnected) {
      sendMessage({ forward, backward, left, right, up, down });
    }
  }, [forward, backward, left, right, up, down, isConnected, sendMessage]);

  // Set up interval for sending state
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        sendMessage({ forward, backward, left, right, up, down });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, forward, backward, left, right, up, down, sendMessage]);

  return (
    <div>
      <h1>Forklift controls</h1>
      <input
        type="text"
        value={urlText}
        onChange={(e) => setUrlText(e.target.value)}
      />
      <button onClick={connect}>Connect</button>
      <div
        className={`connection-status ${
          isConnected ? "connected" : "disconnected"
        }`}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </div>
      <div className="camera-feed">
        {imageUrl && isConnected ? (
          <img
            src={imageUrl}
            alt="Camera feed"
            style={{ transform: "rotate(180deg)" }} // Currently the camera is mounted upside down
          />
        ) : (
          <div className="camera-feed-placeholder">
            {isConnected ? "Waiting for camera feed..." : "Camera disconnected"}
          </div>
        )}
      </div>
      <KeyboardControls
        onKeyPress={simulateKeyPress}
        onKeyRelease={simulateKeyRelease}
      />
    </div>
  );
}

export default App;
