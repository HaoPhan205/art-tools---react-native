import React, { createContext, useContext, useState, ReactNode } from "react";

interface BrandContextType {
  brands: string[];
  selectedBrand: string | null;
  setBrands: (brands: string[]) => void;
  setSelectedBrand: (brand: string | null) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <BrandContext.Provider
      value={{ brands, selectedBrand, setBrands, setSelectedBrand }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error("useBrand must be used within a BrandProvider");
  return context;
};
