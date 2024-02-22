import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Client, ClientConversion } from "../interfaces/client";

type ClientContextType = {
  client: Client | null;
  updateClient: (client: Client) => void;
  clearClient: () => void;
};

export const ClientContext = createContext<ClientContextType>({
  client: null,
  updateClient: () => {},
  clearClient: () => {},
});

type ClientProviderProps = {
  children: ReactNode;
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const storedClient = localStorage.getItem("client");
    if (storedClient != "undefined" && storedClient != undefined && storedClient != null && storedClient != "null") {
      setClient(ClientConversion.fromJson(JSON.parse(storedClient)));
    }
  }, []);

  const updateClient = (newClient: Client) => {
    setClient(newClient);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const clearClient = () => {
    setClient(null);
    localStorage.setItem("client", null);
  };

  return <ClientContext.Provider value={{ client, updateClient, clearClient }}>{children}</ClientContext.Provider>;
};
