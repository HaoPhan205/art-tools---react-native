import { createContext, useContext, useState, ReactNode } from "react";

const HomeSearchContext = createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
});

export const HomeSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <HomeSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </HomeSearchContext.Provider>
  );
};

export const useHomeSearch = () => useContext(HomeSearchContext);
