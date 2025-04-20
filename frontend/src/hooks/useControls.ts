import { useEffect, useState } from "react";

interface Controls {
  fb: number;
  lr: number;
  ud: number;
}

const useControls = () => {
  const [controls, setControls] = useState<Controls>({
    fb: 0,
    lr: 0,
    ud: 0,
  });

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        setControls((prev) => ({ ...prev, fb: 1 }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, fb: -1 }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, lr: -1 }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, lr: 1 }));
        break;
      case "q":
        setControls((prev) => ({ ...prev, ud: 1 }));
        break;
      case "e":
        setControls((prev) => ({ ...prev, ud: -1 }));
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        setControls((prev) => ({ ...prev, fb: 0 }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, fb: 0 }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, lr: 0 }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, lr: 0 }));
        break;
      case "q":
        setControls((prev) => ({ ...prev, ud: 0 }));
        break;
      case "e":
        setControls((prev) => ({ ...prev, ud: 0 }));
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
