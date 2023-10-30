import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

function Header() {
  const { isDarkMode, toggle } = useDarkMode(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
    else {
      document.body.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [isDarkMode]);

  return (
    <header className="py-8 flex items-center gap-4">
      <div className="flex items-center gap-4 mr-auto">
        <img className="w-10" src="/excalibur.svg" alt="excalibur" />
        <span className="text-4xl font-bold tracking-wider">Excalibur</span>
      </div>
      <span className={`cursor-pointer ${isDarkMode ? "i-carbon-sun" : "i-carbon-moon"}`} onClick={toggle} />
      <a className="i-carbon-logo-github" href="https://github.com/kovsu/excalibur" target="_blank" />
    </header>
  );
}

export default Header;
