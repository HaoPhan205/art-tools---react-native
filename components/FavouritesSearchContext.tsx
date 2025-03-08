import { createContext, useContext, useState, ReactNode } from "react";

const FavouritesSearchContext = createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
});

export const FavouritesSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FavouritesSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </FavouritesSearchContext.Provider>
  );
};

export const useFavouritesSearch = () => useContext(FavouritesSearchContext);
