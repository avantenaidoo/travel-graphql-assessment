import { useEffect, useState } from 'react';
import { MdSunny } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";

const ThemeToggle = () => {

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);


  useEffect(() => {

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {

      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme); 
    document.documentElement.classList.toggle('dark', !isDarkMode); 
  };

  return (
    <button className='toggle-btn md:scale-150 mt-2 md:mb-2' onClick={toggleTheme}>
      {isDarkMode ? <MdSunny size={20} /> : <BsFillMoonStarsFill size={20}/>}
    </button> 
  );
};

export default ThemeToggle;