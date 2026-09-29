"use client";

import dynamic from "next/dynamic";
import { HeroFallback } from "./HeroFallback";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function HeroCanvas() {
  return <HeroScene />;
}
