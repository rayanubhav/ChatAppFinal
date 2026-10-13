import React from "react";

function Loading() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse py-2 px-2">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-800 rounded w-2/5"></div>
            <div className="h-2.5 bg-slate-800/50 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;