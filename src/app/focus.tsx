/* Odak modu: sidebar ve alt menü gizlenir, yalnız içerik kalır */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const FocusContext = createContext<{ focus: boolean; setFocus: (v: boolean) => void }>({ focus: false, setFocus: () => {} });

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocus(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [focus]);
  return <FocusContext.Provider value={{ focus, setFocus }}>{children}</FocusContext.Provider>;
}

export const useFocusMode = () => useContext(FocusContext);
