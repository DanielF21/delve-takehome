import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LogsProps {
  messages: string[];
}

export default function Logs({ messages }: LogsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="text-gray-500" />
          <span>Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-gray-50 text-gray-800 p-4 rounded-b-lg font-mono text-sm">
        <pre className="whitespace-pre-wrap">
          {messages.join('\n\n')}
        </pre>
      </CardContent>
    </Card>
  )
}