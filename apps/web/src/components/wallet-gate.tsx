// @ts-nocheck
'use client'

import { useBitteWallet } from "@repo/mintbase"
import { Button } from "@repo/ui/button"
import { useEffect, useState } from "react"

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { isConnected, connect } = useBitteWallet()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short timeout to allow wallet state to initialize
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button onClick={connect} size="lg">
          Connect to Bitte
        </Button>
      </div>
    )
  }

  return <>{children}</>
}