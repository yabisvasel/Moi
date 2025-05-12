import React from 'react';
import { Shield, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500 h-7 w-7" />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-blue-500">AWS</span> Key Scanner
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav>
              <ul className="flex items-center gap-4">
                <li className="text-gray-300 hover:text-white transition-colors">
                  <a href="#" className="font-medium">Dashboard</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="font-medium">History</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="font-medium">Settings</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="font-medium">About</a>
                </li>
              </ul>
            </nav>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6 text-gray-300" />
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="mt-4 md:hidden">
            <nav className="py-2">
              <ul className="flex flex-col space-y-3">
                <li className="text-gray-300 hover:text-white transition-colors">
                  <a href="#" className="block font-medium">Dashboard</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="block font-medium">History</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="block font-medium">Settings</a>
                </li>
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#" className="block font-medium">About</a>
                </li>
              </ul>
            </nav>
            
            <div className="py-3 border-t border-gray-800 mt-3">
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 font-medium text-gray-300 hover:text-white transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span>Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Dark mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;