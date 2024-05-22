import React, { createContext, useState, ReactNode } from "react";

type AdminDrawerContextType = {
  isAdminDrawerOpen: boolean | undefined;
  openAdminDrawer: () => void;
  closeAdminDrawer: () => void;
};

export const AdminDrawerContext = createContext<AdminDrawerContextType>({
  isAdminDrawerOpen: true,
  openAdminDrawer: () => {},
  closeAdminDrawer: () => {},
});

type AdminDrawerProviderProps = {
  children: ReactNode;
};

export const AdminDrawerProvider = ({ children }: AdminDrawerProviderProps) => {
  const [isAdminDrawerOpen, setAdminDrawerOpen] = useState(false);

  const openAdminDrawer = () => setAdminDrawerOpen(true);
  const closeAdminDrawer = () => setAdminDrawerOpen(false);

  return (
    <AdminDrawerContext.Provider
      value={{
        isAdminDrawerOpen,
        openAdminDrawer,
        closeAdminDrawer,
      }}
    >
      {children}
    </AdminDrawerContext.Provider>
  );
};
