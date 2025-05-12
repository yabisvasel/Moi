import React, { useState } from 'react';
import Header from './layout/Header';
import ScanForm from './scan/ScanForm';
import ScanResults from './scan/ScanResults';
import StatusBar from './layout/StatusBar';
import { ScanStatus, ScanResult } from '../types';

const Dashboard: React.FC = () => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>({
    isScanning: false,
    progress: 0,
    total: 0,
    startTime: null,
    endTime: null,
  });
  
  const [results, setResults] = useState<ScanResult[]>([]);
  
  const handleStartScan = (urls: string[], options: any) => {
    // In a real implementation, this would trigger the actual scan
    setScanStatus({
      isScanning: true,
      progress: 0,
      total: urls.length,
      startTime: new Date(),
      endTime: null,
    });
    
    // Simulate scanning with sample data
    simulateScan(urls, options);
  };
  
  const simulateScan = (urls: string[], options: any) => {
    const demoResults: ScanResult[] = [];
    const totalItems = urls.length;
    let currentProgress = 0;
    
    // Clear previous results when starting a new scan
    setResults([]);
    
    const intervalId = setInterval(() => {
      currentProgress += 1;
      
      if (currentProgress <= totalItems) {
        // Update progress
        setScanStatus(prev => ({
          ...prev,
          progress: currentProgress,
        }));
        
        // Add a new result every few steps
        if (currentProgress % 2 === 0 && currentProgress <= totalItems) {
          const url = urls[currentProgress - 1];
          const newResult: ScanResult = {
            id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: url,
            keyType: Math.random() > 0.7 ? 'SendGrid' : 'AWS',
            keyValue: Math.random() > 0.7 
              ? `SG.${Math.random().toString(36).substr(2, 22)}.${Math.random().toString(36).substr(2, 43)}`
              : `AKIA${Math.random().toString(36).toUpperCase().substr(2, 16)}`,
            discoveredAt: new Date(),
            sourceFile: `/assets/js/main-${Math.floor(Math.random() * 100)}.js`,
          };
          
          demoResults.push(newResult);
          setResults(prev => [...prev, newResult]);
        }
      } else {
        // Scan completed
        clearInterval(intervalId);
        setScanStatus(prev => ({
          ...prev,
          isScanning: false,
          endTime: new Date(),
        }));
      }
    }, 300);
  };
  
  const handleStopScan = () => {
    setScanStatus(prev => ({
      ...prev,
      isScanning: false,
      endTime: new Date(),
    }));
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ScanForm 
                onStartScan={handleStartScan} 
                onStopScan={handleStopScan}
                isScanning={scanStatus.isScanning}
              />
            </div>
            <div className="lg:col-span-2">
              <ScanResults 
                results={results}
                isScanning={scanStatus.isScanning}
              />
            </div>
          </div>
        </div>
      </main>
      <StatusBar 
        status={scanStatus}
        resultsCount={results.length}
      />
    </div>
  );
};

export default Dashboard;