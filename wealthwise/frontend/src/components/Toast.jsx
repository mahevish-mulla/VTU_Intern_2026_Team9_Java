import { useState } from "react";

export default function Toast({ message, onDone }) {
  useState(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  });

  return (
    <div className="toast">
      <span className="toast__icon">✓</span>
      {message}
    </div>
  );
}
