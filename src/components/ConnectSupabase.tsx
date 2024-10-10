'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Supabase Compliance Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg mb-6">
            Check if your Supabase configuration is set up for compliance
          </p>
          <div className="flex justify-center">
            <button
              className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
              onClick={() => {
                // Redirect to the auth route that handles authentication
                window.location.href = '/api/auth';
              }}
            >
              <Image
                src="connect-supabase-light.svg"
                alt="Connect Supabase"
                width={156}
                height={31}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
