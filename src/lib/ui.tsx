import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  scanOpen: boolean;
  setScanOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean | ((v: boolean) => boolean)) => void;
};

const UIContext = createContext<Ctx>(null!);

export function UIProvider({ children }: { children: ReactNode }) {
  const [scanOpen, setScanOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <UIContext.Provider value={{ scanOpen, setScanOpen, searchOpen, setSearchOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
