import { createContext, useContext, useState } from "react";

interface FavoriteContextType {
  favorites: string[];
  toggleFavorite: (item: { id: string }) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (item: { id: string }) => {
    setFavorites((prev) =>
      prev.includes(item.id)
        ? prev.filter((fav) => fav !== item.id)
        : [...prev, item.id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
