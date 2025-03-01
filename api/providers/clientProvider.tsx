import { createContext, useState, useEffect, ReactNode } from "react";
import { Client, ClientConversion } from "../interfaces/client";

type ClientContextType = {
  client: Client | null;
  updateClient: (client: Client) => void;
  clearClient: () => void;
  setCurrentClient: (client: Client) => void;
  isLoading: boolean;
};

export const ClientContext = createContext<ClientContextType>({
  client: null,
  updateClient: () => {},
  clearClient: () => {},
  setCurrentClient: () => {},
  isLoading: true, // Default to loading initially
});

type ClientProviderProps = {
  children: ReactNode;
};

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedClient = localStorage.getItem("client");

    if (
      storedClient &&
      storedClient !== "undefined" &&
      storedClient !== "null"
    ) {
      try {
        const clientLs = ClientConversion.fromJson(JSON.parse(storedClient));
        setClient(clientLs);
      } catch (error) {
        console.error("Error parsing client data from localStorage:", error);
      }
    }

    setIsLoading(false); // Set loading to false once we've checked localStorage
  }, []);

  const updateClient = (newClient: Client) => {
    setClient(newClient);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const setCurrentClient = (newClient: Client) => {
    setClient(newClient);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const clearClient = async () => {
    setClient(null);
    await fetch("/api/client/client/logout");
    localStorage.removeItem("client");
  };

  return (
    <ClientContext.Provider
      value={{ client, updateClient, setCurrentClient, clearClient, isLoading }}
    >
      {children}
    </ClientContext.Provider>
  );
};
