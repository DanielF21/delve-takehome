import { Shield, Check as CheckIcon, X } from 'lucide-react'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RlsData {
  projectId: string;
  projectName: string;
  rlsData: Array<{
    schemaname: string;
    tablename: string;
    rls_status: string; // 'Enabled' or 'Disabled'
  }>;
}

interface RlsCardProps {
  rlsData: RlsData[] | null;
}

export default function RlsCard({ rlsData }: RlsCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="text-green-500" />
          <span>Row Level Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rlsData ? (
          <div>
            {rlsData.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-medium">{project.projectName}</h3>
                <table className="w-full text-sm text-left text-gray-500 mt-2">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Schema</th>
                      <th scope="col" className="px-6 py-3">Table</th>
                      <th scope="col" className="px-6 py-3">RLS Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.rlsData.map((table, idx) => (
                      <tr key={idx} className="bg-white border-b">
                        <td className="px-6 py-4">{table.schemaname}</td>
                        <td className="px-6 py-4">{table.tablename}</td>
                        <td className="px-6 py-4">
                          {table.rls_status === 'Enabled' ? (
                            <span className="flex items-center text-green-500">
                              <CheckIcon className="w-4 h-4 mr-1" /> Enabled
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500">
                              <X className="w-4 h-4 mr-1" /> Disabled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </>
  )
}