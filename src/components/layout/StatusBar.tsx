import React from 'react';
import { Clock, Database, Zap } from 'lucide-react';
import { ScanStatus } from '../../types';

interface StatusBarProps {
  status: ScanStatus;
  resultsCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, resultsCount }) => {
  const formatDuration = () => {
    if (!status.startTime) return '00:00:00';
    
    const endTime = status.endTime || new Date();
    const durationMs = endTime.getTime() - status.startTime.getTime();
    
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-6 py-3">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-gray-300">
                {status.isScanning ? 'Scanning...' : 'Ready'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-300">
                {resultsCount} keys found
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-300">
                {formatDuration()}
              </span>
            </div>
            
            {status.isScanning && (
              <div className="flex items-center gap-2">
                <div className="relative w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(status.progress / status.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">
                  {status.progress}/{status.total}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;