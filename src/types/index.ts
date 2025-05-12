export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  total: number;
  startTime: Date | null;
  endTime: Date | null;
}

export interface ScanResult {
  id: string;
  url: string;
  keyType: 'AWS' | 'SendGrid';
  keyValue: string;
  discoveredAt: Date;
  sourceFile: string;
}

export interface ScanOptions {
  threads: number;
  timeout: number;
  scanPatterns: {
    aws: boolean;
    sendgrid: boolean;
  };
}