import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Client, ClientConversion } from "../interfaces/client";

type ClientContextType = {
  client: Client | null;
  updateClient: (client: Client) => void;
  clearClient: () => void;
  setCurrentClient: (client: Client) => void;
};

export const ClientContext = createContext<ClientContextType>({
  client: null,
  updateClient: () => {},
  clearClient: () => {},
  setCurrentClient: () => {},
});

type ClientProviderProps = {
  children: ReactNode;
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const storedClient = localStorage.getItem("client");
    if (
      storedClient != "undefined" &&
      storedClient != undefined &&
      storedClient != null &&
      storedClient != "null"
    ) {
      let clientLs = ClientConversion.fromJson(JSON.parse(storedClient));
      console.log("client from local storage: ", clientLs);
      setClient(clientLs);
    }
  }, []);

  const updateClient = (newClient: Client) => {
    console.log("client to set in local storage: ", newClient);
    setClient(newClient);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const setCurrentClient = (newClient: Client) => {
    console.log("client to set in local storage: ", newClient);
    setClient(newClient);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const clearClient = () => {
    setClient(null);
    localStorage.removeItem("client");
  };

  return (
    <ClientContext.Provider
      value={{ client, updateClient, setCurrentClient, clearClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};
