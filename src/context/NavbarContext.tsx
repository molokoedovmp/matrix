import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavbarContextType {
  isCatalogOpen: boolean;
  setIsCatalogOpen: (isOpen: boolean) => void;
  hoveredCategory: number | null;
  setHoveredCategory: (categoryId: number | null) => void;
  expandedCategories: number[];
  setExpandedCategories: React.Dispatch<React.SetStateAction<number[]>>;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  openCategoryMenu: (categoryId: number) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openCategoryMenu = (categoryId: number) => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      setIsMenuOpen(true);
      setExpandedCategories((prev: number[]) => 
        prev.includes(categoryId) ? prev : [...prev, categoryId]
      );
    } else {
      setIsCatalogOpen(true);
      setHoveredCategory(categoryId);
    }
  };

  return (
    <NavbarContext.Provider value={{ 
      isCatalogOpen, 
      setIsCatalogOpen, 
      hoveredCategory, 
      setHoveredCategory,
      expandedCategories,
      setExpandedCategories,
      isMenuOpen,
      setIsMenuOpen,
      openCategoryMenu
    }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}; 