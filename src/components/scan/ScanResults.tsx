import React, { useState } from 'react';
import { Download, Filter, Copy, ExternalLink } from 'lucide-react';
import { ScanResult } from '../../types';

interface ScanResultsProps {
  results: ScanResult[];
  isScanning: boolean;
}

const ScanResults: React.FC<ScanResultsProps> = ({ results, isScanning }) => {
  const [filter, setFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof ScanResult>('discoveredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (key: keyof ScanResult) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };
  
  const filteredResults = results.filter(result => {
    if (!filter) return true;
    const lowerFilter = filter.toLowerCase();
    return (
      result.url.toLowerCase().includes(lowerFilter) ||
      result.keyType.toLowerCase().includes(lowerFilter) ||
      result.keyValue.toLowerCase().includes(lowerFilter) ||
      result.sourceFile.toLowerCase().includes(lowerFilter)
    );
  });
  
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'discoveredAt') {
      return sortOrder === 'asc' 
        ? a[sortBy].getTime() - b[sortBy].getTime()
        : b[sortBy].getTime() - a[sortBy].getTime();
    }
    
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };
  
  const handleExportResults = (format: 'json' | 'csv' | 'txt') => {
    let content: string;
    let filename: string;
    let mimeType: string;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(results, (key, value) => {
          if (key === 'discoveredAt') return value.toISOString();
          return value;
        }, 2);
        filename = `aws-key-scan-results-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      
      case 'csv':
        const headers = ['URL', 'Key Type', 'Key Value', 'Source File', 'Discovered At'];
        const rows = results.map(r => [
          r.url,
          r.keyType,
          r.keyValue,
          r.sourceFile,
          r.discoveredAt.toISOString()
        ]);
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename = `aws-key-scan-results-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      
      case 'txt':
        content = results.map(r => `${r.url} - ${r.keyType}: ${r.keyValue} (${r.sourceFile})`).join('\n');
        filename = `aws-key-scan-results-${Date.now()}.txt`;
        mimeType = 'text/plain';
        break;
      
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">
            Scan Results 
            <span className="ml-2 text-sm font-normal text-gray-400">
              {results.length} keys found
            </span>
          </h2>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text"
                placeholder="Filter results"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              />
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-1 bg-gray-900 hover:bg-gray-850 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <div className="absolute right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 w-32 py-1 hidden group-hover:block">
                <button
                  onClick={() => handleExportResults('json')}
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-850 transition-colors"
                >
                  JSON
                </button>
                <button
                  onClick={() => handleExportResults('csv')}
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-850 transition-colors"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExportResults('txt')}
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-850 transition-colors"
                >
                  Text
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            {isScanning ? (
              <>
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Scanning for exposed keys...</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-2">No keys found yet</p>
                <p className="text-gray-500 text-sm">Configure your scan and click "Start Scan" to begin</p>
              </>
            )}
          </div>
        ) : (
          <div className="min-w-full table-fixed overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-850">
                <tr>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors ${sortBy === 'url' ? 'text-gray-200' : ''}`}
                    onClick={() => handleSort('url')}
                  >
                    URL
                    {sortBy === 'url' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors ${sortBy === 'keyType' ? 'text-gray-200' : ''}`}
                    onClick={() => handleSort('keyType')}
                  >
                    Key Type
                    {sortBy === 'keyType' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Key Value
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors hidden md:table-cell ${sortBy === 'discoveredAt' ? 'text-gray-200' : ''}`}
                    onClick={() => handleSort('discoveredAt')}
                  >
                    Discovered
                    {sortBy === 'discoveredAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {sortedResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[200px]"
                        >
                          {result.url}
                        </a>
                        <ExternalLink className="h-3 w-3 text-gray-500" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 md:hidden">
                        {result.discoveredAt.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.keyType === 'AWS' 
                          ? 'bg-orange-900 text-orange-300'
                          : 'bg-purple-900 text-purple-300'
                      }`}>
                        {result.keyType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <code className="font-mono bg-gray-900 px-2 py-1 rounded text-xs overflow-hidden overflow-ellipsis max-w-[150px] md:max-w-[250px]">
                          {result.keyValue}
                        </code>
                        <button
                          onClick={() => handleCopyKey(result.keyValue)}
                          className="text-gray-500 hover:text-gray-300 transition-colors"
                          title="Copy key"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.sourceFile}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                      {result.discoveredAt.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanResults;