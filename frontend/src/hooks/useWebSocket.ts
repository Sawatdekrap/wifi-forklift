import { useEffect, useRef, useCallback, useState } from "react";

interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  reconnectInterval = 5000,
}: WebSocketOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<number>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(url);
    // Configure WebSocket to handle binary messages
    ws.current.binaryType = "blob";

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      reconnectTimeout.current = window.setTimeout(connect, reconnectInterval);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [url, reconnectInterval]);

  const sendMessage = useCallback((message: string | object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const data =
        typeof message === "string" ? message : JSON.stringify(message);
      ws.current.send(data);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  return {
    sendMessage,
    addMessageListener: (callback: (message: MessageEvent) => void) => {
      if (ws.current) {
        ws.current.onmessage = callback;
      }
    },
    isConnected,
    disconnect: () => {
      if (ws.current) {
        ws.current.close();
      }
    },
  };
};
