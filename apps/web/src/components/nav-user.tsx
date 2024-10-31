// @ts-nocheck
"use client"

import { useBitteWallet } from "@mintbase-js/react"
import { Button } from "@repo/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useSidebar } from "@repo/ui/shadcn-sidebar"

export function NavUser() {
  const { isConnected, selector, connect, activeAccountId } = useBitteWallet()
  const { state } = useSidebar()

  const handleSignout = async () => {
    const wallet = await selector.wallet()
    return wallet.signOut()
  }

  const handleSignIn = async () => {
    return connect()
  }

  const handleClick = () => {
    if (isConnected) {
      handleSignout()
    } else {
      handleSignIn()
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      className={`flex flex-1 items-center justify-center text-white ${
        isConnected 
          ? "bg-destructive/90 hover:bg-destructive/70 dark:bg-destructive/30 dark:hover:bg-destructive/90" 
          : "bg-green-700 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-400"
      }`}
    >
      {isConnected ? <LogOut className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
      {state === "expanded" && (
        <span>{isConnected ? activeAccountId : "Connect To NEAR"}</span>
      )}
    </Button>
  )
}
