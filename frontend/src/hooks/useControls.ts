import { useEffect, useState } from "react";

interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

const useControls = () => {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        setControls((prev) => ({ ...prev, forward: true }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, backward: true }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, left: true }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, right: true }));
        break;
      case "q":
        setControls((prev) => ({ ...prev, up: true }));
        break;
      case "e":
        setControls((prev) => ({ ...prev, down: true }));
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        setControls((prev) => ({ ...prev, forward: false }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, backward: false }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, left: false }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, right: false }));
        break;
      case "q":
        setControls((prev) => ({ ...prev, up: false }));
        break;
      case "e":
        setControls((prev) => ({ ...prev, down: false }));
        break;
    }
  };

  const simulateKeyPress = (key: string) => {
    const event = new KeyboardEvent("keydown", { key });
    document.dispatchEvent(event);
  };

  const simulateKeyRelease = (key: string) => {
    const event = new KeyboardEvent("keyup", { key });
    document.dispatchEvent(event);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return { ...controls, simulateKeyPress, simulateKeyRelease };
};

export default useControls;
