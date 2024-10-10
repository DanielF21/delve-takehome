"use client";

import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

// Define the type for RLS data
type RlsData = {
  projectId: string;
  projectName: string;
  rlsData: Array<{
    schemaname: string;
    tablename: string;
    rls_status: string; // 'Enabled' or 'Disabled'
  }>;
};

// Define the type for PITR data
type PitrData = {
  projectId: string;
  projectName: string;
  pitrEnabled: boolean;
};

export default function Check({ onDataFetched }: { onDataFetched: (mfaData: { user_name: string, email: string, mfa_enabled: boolean }[], rlsData: RlsData[], pitrData: PitrData[]) => void }) {
  const handleCheck = async () => {
    try {
      const mfaResponse = await fetch('/api/mfa-check');
      const mfaData = await mfaResponse.json();
      console.log('MFA Data:', mfaData);

      const rlsResponse = await fetch('/api/rls-check');
      const rlsData: RlsData[] = await rlsResponse.json();
      console.log('RLS Data:', rlsData);

      const pitrResponse = await fetch('/api/pitr-check');
      const pitrData: PitrData[] = await pitrResponse.json();
      console.log('PITR Data:', pitrData);

      // Pass all datasets to the parent component
      onDataFetched(mfaData, rlsData, pitrData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Button onClick={handleCheck} className="bg-green-500 hover:bg-green-600 text-white">
      <CheckCircle className="mr-2 h-4 w-4" />
      Check your Config
    </Button>
  );
}