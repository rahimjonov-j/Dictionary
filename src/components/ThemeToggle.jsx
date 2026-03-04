// ThemeToggle.jsx
import { Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
  <>
<div className="flex items-center gap-3">
      <button
      onClick={toggleTheme}
      className={`
        relative w-12 h-6 rounded-full transition-colors
        ${theme === "dark" ? "bg-[#A445ED]" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
          shadow-md transform transition-transform
          ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
        `}
      />
      <span className="absolute right-1 top-1 text-sm">
        {theme === "dark" }
      </span>
      
    </button>
  <div className="text-gray-500 dark:text-[#A445ED] cursor-pointer" onClick={toggleTheme}>
      <Moon/>
  </div>
</div>
  </>
  );
}