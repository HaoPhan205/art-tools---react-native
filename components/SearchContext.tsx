import { createContext, useContext, useState, ReactNode } from "react";

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
