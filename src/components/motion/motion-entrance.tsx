"use client";

import { createContext, useContext } from "react";

const MotionEntranceContext = createContext(true);

export function MotionEntranceProvider({
  entrance,
  children,
}: {
  entrance: boolean;
  children: React.ReactNode;
}) {
  return (
    <MotionEntranceContext.Provider value={entrance}>
      {children}
    </MotionEntranceContext.Provider>
  );
}

export function useMotionEntrance(): boolean {
  return useContext(MotionEntranceContext);
}
