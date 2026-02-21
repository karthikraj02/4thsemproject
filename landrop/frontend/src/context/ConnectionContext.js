import { createContext, useState } from "react";

export const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {

  const [connectedDevice, setConnectedDevice] = useState(null);

  return (
    <ConnectionContext.Provider
      value={{ connectedDevice, setConnectedDevice }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}