import { BarChart2, Check as CheckIcon, X } from 'lucide-react'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  user_name: string
  email: string
  mfa_enabled: boolean
}

interface MfaCardProps {
  users: User[]
  checkPerformed: boolean
}

export default function MfaCard({ users }: MfaCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart2 className="text-blue-500" />
          <span>MFA Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">MFA Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.user_name}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.mfa_enabled ? (
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
      </CardContent>
    </>
  )
}