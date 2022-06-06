import React from 'react';

interface ContextType {
  pageData?: {
    [random: string]: any;
  };
}

interface AppContextType {
  children: React.ReactNode;
  context?: ContextType;
  [random: string]: any;
}

export const AppContext = React.createContext<ContextType>({});

const AppContextElemnet: React.FC<AppContextType> = ({ children, context = {} }) => {
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default AppContextElemnet;
