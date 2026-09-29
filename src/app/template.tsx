"use client";

import React, { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(isReduced);
  }, []);

  return (
    <div
      className={reduceMotion ? "" : "animate-page-enter"}
    >
      {children}
    </div>
  );
}
