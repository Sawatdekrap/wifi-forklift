import { useEffect, useState } from "react";
import "./App.css";
import useControls from "./hooks/useControls";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const [url, setUrl] = useState("");
  const [urlText, setUrlText] = useState("");

  const { fb, lr, ud } = useControls();
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
        console.log("Received message: ", message);
      });
    }
  }, [isConnected, addMessageListener]);

  // Send state immediately when controls change
  useEffect(() => {
    if (isConnected) {
      sendMessage({ fb, lr, ud });
    }
  }, [fb, lr, ud, isConnected, sendMessage]);

  // Set up interval for sending state
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        sendMessage({ fb, lr, ud });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, fb, lr, ud, sendMessage]);

  return (
    <div>
      <h1>Forklift controls</h1>
      <input
        type="text"
        value={urlText}
        onChange={(e) => setUrlText(e.target.value)}
      />
      <button onClick={connect}>Connect</button>
      <div>{isConnected ? "Connected" : "Disconnected"}</div>
    </div>
  );
}

export default App;
