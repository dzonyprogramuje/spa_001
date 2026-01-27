import { Switch } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcherComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      isSelected={theme === "light"}
      size="md"
      color="primary"
      startContent={<Sun size={18} />}
      endContent={<Moon size={18} />}
      onValueChange={(isSelected) => setTheme(isSelected ? "light" : "dark")}
    />
  );
};
