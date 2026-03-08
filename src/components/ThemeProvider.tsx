import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface WhiteLabelConfig {
  id: number;
  empresa_id: number;
  nome_sistema: string;
  logo_url: string | null;
  cor_primaria: string;
  cor_secundaria: string;
  cor_fundo_claro: string;
  cor_fundo_escuro: string;
}

interface ThemeContextType {
  config: WhiteLabelConfig | null;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setEmpresaId: (id: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [empresaId, setEmpresaId] = useState<number>(1); // Default to 1 for demo
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing darkMode from localStorage', e);
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/config/${empresaId}`);
        setConfig(response.data);
        
        // Apply CSS variables
        const root = document.documentElement;
        root.style.setProperty('--color-primary', response.data.cor_primaria);
        root.style.setProperty('--color-accent', response.data.cor_secundaria);
      } catch (error) {
        console.error('Failed to fetch white-label config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [empresaId]);

  return (
    <ThemeContext.Provider value={{ config, isLoading, isDarkMode, toggleDarkMode, setEmpresaId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
