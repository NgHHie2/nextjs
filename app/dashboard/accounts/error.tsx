"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error in documents page:", error);
  }, [error]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Server Error</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
