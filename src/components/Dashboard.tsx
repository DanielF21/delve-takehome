"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import Check from "./Check"
import MfaCard from "./mfaCard"
import RlsCard from "./rlsCard"
import PitrCard from "./pitrCard"
import Logs from "./Logs"
import Chatbot from "./Chatbot"  // Import the Chatbot component

interface User {
  user_name: string
  email: string
  mfa_enabled: boolean
}

interface RlsData {
  projectId: string;
  projectName: string;
  rlsData: Array<{
    schemaname: string;
    tablename: string;
    rls_status: string; // 'Enabled' or 'Disabled'
  }>;
}

interface PitrData {
  projectId: string;
  projectName: string;
  pitrEnabled: boolean;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [rlsData, setRlsData] = useState<RlsData[] | null>(null);
  const [pitrData, setPitrData] = useState<PitrData[] | null>(null);
  const [checkPerformed, setCheckPerformed] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleDataFetched = (fetchedUsers: User[], fetchedRlsData: RlsData[], fetchedPitrData: PitrData[]) => {
    setUsers(fetchedUsers);
    setRlsData(fetchedRlsData);
    setPitrData(fetchedPitrData);
    setCheckPerformed(true);

    const timestamp = new Date().toISOString();

    // Construct messages for logs with timestamps
    const mfaMessage = fetchedUsers.every(user => user.mfa_enabled)
      ? `${timestamp} - Every user has MFA enabled. Checked ${fetchedUsers.length} users.`
      : `${timestamp} - The following users do not have MFA enabled:\n${fetchedUsers.filter(user => !user.mfa_enabled).map(user => `${user.user_name} (${user.email})`).join('\n')}`;

    const rlsMessage = fetchedRlsData.every(project => project.rlsData.every(table => table.rls_status === 'Enabled'))
      ? `${timestamp} - Every table in this org has RLS enabled. Checked ${fetchedRlsData.length} projects.`
      : `${timestamp} - The following tables do not have RLS enabled:\n${fetchedRlsData.flatMap(project => project.rlsData.filter(table => table.rls_status !== 'Enabled').map(table => `${project.projectName} - ${table.schemaname}.${table.tablename}`)).join('\n')}`;

    const pitrMessage = fetchedPitrData.every(project => project.pitrEnabled)
      ? `${timestamp} - Point in Time Recovery is enabled for all projects. Checked ${fetchedPitrData.length} projects.`
      : `${timestamp} - The following projects do not have PITR enabled:\n${fetchedPitrData.filter(project => !project.pitrEnabled).map(project => project.projectName).join('\n')}`;

    setLogMessages([mfaMessage, rlsMessage, pitrMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Supabase Compliance Dashboard</h1>
          <Check onDataFetched={handleDataFetched} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="md:col-span-2">
                <MfaCard users={users} checkPerformed={checkPerformed} />
              </Card>
              <Card>
                <RlsCard rlsData={rlsData} />
              </Card>
              <Card>
                <PitrCard pitrData={pitrData} />
              </Card>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <Logs messages={logMessages} />
            </Card>
            <Card>
              <Chatbot />  {/* Move the Chatbot component here */}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}