import React, { useState } from 'react';
import { Play, FilePlus, StopCircle, Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface ScanFormProps {
  onStartScan: (urls: string[], options: any) => void;
  onStopScan: () => void;
  isScanning: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, onStopScan, isScanning }) => {
  const [urls, setUrls] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [threads, setThreads] = useState<number>(50);
  const [timeout, setTimeout] = useState<number>(10);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse URLs from textarea
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urlList.length === 0) return;
    
    const options = {
      threads,
      timeout,
      scanAWS: true,
      scanSendGrid: true,
    };
    
    onStartScan(urlList, options);
  };
  
  const handlePasteUrls = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrls(text);
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };
  
  const handleClear = () => {
    setUrls('');
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-4">Scan Configuration</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Target URLs 
                <span className="text-gray-500 text-xs ml-1">(one per line)</span>
              </label>
              <div className="relative">
                <textarea 
                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isScanning}
                ></textarea>
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    type="button"
                    className="p-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                    onClick={handlePasteUrls}
                    disabled={isScanning}
                  >
                    Paste
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                    onClick={handleClear}
                    disabled={isScanning}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500">
                  {urls.split('\n').filter(line => line.trim().length > 0).length} URLs
                </div>
                <button
                  type="button"
                  className="text-xs flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Settings className="h-3 w-3" />
                  <span>Advanced options</span>
                  {showAdvanced ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="bg-gray-850 rounded-md p-3 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Threads
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      max="300"
                      value={threads}
                      onChange={(e) => setThreads(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isScanning}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Timeout (seconds)
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="60"
                      value={timeout}
                      onChange={(e) => setTimeout(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isScanning}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                      defaultChecked
                      disabled={isScanning}
                    />
                    AWS Keys (AKIA)
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-700 text-blue-500 focus:ring-blue-500"
                      defaultChecked
                      disabled={isScanning}
                    />
                    SendGrid Keys
                  </label>
                </div>
              </div>
            )}
            
            {isScanning ? (
              <button
                type="button"
                onClick={onStopScan}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <StopCircle className="h-5 w-5" />
                Stop Scan
              </button>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={urls.trim().length === 0}
              >
                <Play className="h-5 w-5" />
                Start Scan
              </button>
            )}
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <FilePlus className="h-4 w-4" />
              <span>Or drop a file here</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScanForm;