"use client";

import { BitteWalletContextProvider } from "@mintbase-js/react";

const BitteWalletSetup = {
  contractAddress:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 
    "akjsfhkajhsdasd.testnet",
  network: process.env.NEXT_PUBLIC_NETWORK || "testnet",
  callbackUrl:
    process.env.NEXT_PUBLIC_CALLBACK_URL_WEB ||
    process.env.NEXT_PUBLIC_CALLBACK_URL_DOCS ||
    (typeof window !== "undefined" ? window.location.origin : ""),
};

export function BitteProvider({ children }: { children: React.ReactNode }) {
  return (
    <BitteWalletContextProvider {...BitteWalletSetup} onlyBitteWallet>
      {children}
    </BitteWalletContextProvider>
  );
}