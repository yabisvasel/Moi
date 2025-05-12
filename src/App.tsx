import React from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;