import { useMemo, useState } from "react";
import { ThemeContext } from "./themeContextValue";

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const value = useMemo(
    () => ({
      darkMode,
      toggleTheme: () => setDarkMode((current) => !current),
    }),
    [darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
