import React from "react";

function Loading() {
  return (
    // Updated to be a container that fits inside its parent,
    // rather than taking the full screen.
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );
}

export default Loading;