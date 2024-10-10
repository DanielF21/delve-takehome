import { Clock, Check as CheckIcon, X } from 'lucide-react'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PitrData {
  projectId: string;
  projectName: string;
  pitrEnabled: boolean;
}

interface PitrCardProps {
  pitrData: PitrData[] | null;
}

export default function PitrCard({ pitrData }: PitrCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="text-purple-500" />
          <span>Point in Time Recovery</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pitrData ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Project</th>
                    <th scope="col" className="px-6 py-3">PITR Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pitrData.map((project, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {project.projectName}
                      </td>
                      <td className="px-6 py-4">
                        {project.pitrEnabled ? (
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