import { useCallback } from "react";

interface KeyboardControlsProps {
  onKeyPress: (key: string) => void;
  onKeyRelease: (key: string) => void;
}

const KeyboardControls = ({
  onKeyPress,
  onKeyRelease,
}: KeyboardControlsProps) => {
  const handleKeyDown = useCallback(
    (key: string) => {
      onKeyPress(key);
    },
    [onKeyPress]
  );

  const handleKeyUp = useCallback(
    (key: string) => {
      onKeyRelease(key);
    },
    [onKeyRelease]
  );

  return (
    <div className="keyboard-controls">
      <div className="keyboard-row">
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("q")}
          onMouseUp={() => handleKeyUp("q")}
          onMouseLeave={() => handleKeyUp("q")}
        >
          <div className="key-content">
            <div className="key-letter">Q</div>
            <div className="key-function">lift</div>
          </div>
        </button>
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("w")}
          onMouseUp={() => handleKeyUp("w")}
          onMouseLeave={() => handleKeyUp("w")}
        >
          <div className="key-content">
            <div className="key-letter">W</div>
            <div className="key-function">forward</div>
          </div>
        </button>
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("e")}
          onMouseUp={() => handleKeyUp("e")}
          onMouseLeave={() => handleKeyUp("e")}
        >
          <div className="key-content">
            <div className="key-letter">E</div>
            <div className="key-function">drop</div>
          </div>
        </button>
      </div>
      <div className="keyboard-row">
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("a")}
          onMouseUp={() => handleKeyUp("a")}
          onMouseLeave={() => handleKeyUp("a")}
        >
          <div className="key-content">
            <div className="key-letter">A</div>
            <div className="key-function">left</div>
          </div>
        </button>
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("s")}
          onMouseUp={() => handleKeyUp("s")}
          onMouseLeave={() => handleKeyUp("s")}
        >
          <div className="key-content">
            <div className="key-letter">S</div>
            <div className="key-function">backward</div>
          </div>
        </button>
        <button
          className="key-button"
          onMouseDown={() => handleKeyDown("d")}
          onMouseUp={() => handleKeyUp("d")}
          onMouseLeave={() => handleKeyUp("d")}
        >
          <div className="key-content">
            <div className="key-letter">D</div>
            <div className="key-function">right</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default KeyboardControls;
