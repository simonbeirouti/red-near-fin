// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card"
import { useBitteWallet } from "@repo/mintbase"

interface ContractFunction {
  name: string;
  kind: 'view' | 'call';
  params?: {
    serialization_type: string;
    args: {
      name: string;
      type_schema: {
        type: string;
      };
    }[];
  };
}

interface ContractABI {
  body: {
    functions: ContractFunction[];
  };
}

async function loadContractABI() {
  try {
    const response = await fetch('/api/contract-abi');
    if (!response.ok) {
      throw new Error('Failed to load contract ABI');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    throw error;
  }
}

export default function DebugPage() {
  const { isConnected, activeAccountId, selector, connect } = useBitteWallet();
  const [contractABI, setContractABI] = useState<ContractABI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    loadContractABI()
      .then(setContractABI)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!isConnected) {
    return <div className="flex justify-center items-center min-h-screen"><Button onClick={connect}>Connect to Bitte</Button></div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  const handleInputChange = (funcName: string, paramName: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [`${funcName}_${paramName}`]: value
    }));
  };

  const executeFunction = async (func: ContractFunction) => {
    try {
      const functionArgs = func.params?.args.reduce((acc: any, arg: any) => ({
        ...acc,
        [arg.name]: inputs[`${func.name}_${arg.name}`]
      }), {});

      const wallet = await selector.wallet();
      let result;

      if (func.kind === 'view') {
        result = await wallet.viewMethod({
          contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
          method: func.name,
          args: functionArgs || {}
        });
      } else if (func.kind === 'call') {
        result = await wallet.signAndSendTransaction({
          signerId: activeAccountId,
          receiverId: process.env.NEXT_PUBLIC_CONTRACT_NAME!,
          actions: [{
            type: 'FunctionCall',
            params: {
              methodName: func.name,
              args: functionArgs || {},
              gas: '30000000000000',
              deposit: '0'
            }
          }]
        });
      }

      setResults(prev => ({
        ...prev,
        [func.name]: result
      }));
    } catch (error: any) {
      console.error(`Error executing ${func.name}:`, error);
      setResults(prev => ({
        ...prev,
        [func.name]: `Error: ${error.message || error}`
      }));
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-3xl space-y-6">
        {contractABI.body.functions.map((func: ContractFunction) => (
          <Card key={func.name} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{func.name}</span>
                <span className="text-sm bg-slate-200 px-2 py-1 rounded">
                  {func.kind}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {func.params?.args.map((arg) => (
                <div key={arg.name} className="space-y-2">
                  <label className="text-sm font-medium">
                    {arg.name} ({arg.type_schema.type})
                  </label>
                  <Input
                    type="text"
                    value={inputs[`${func.name}_${arg.name}`] || ''}
                    onChange={(e) => handleInputChange(func.name, arg.name, e.target.value)}
                    placeholder={`Enter ${arg.name}`}
                  />
                </div>
              ))}
              
              <Button 
                onClick={() => executeFunction(func)}
                className="w-full"
              >
                Execute {func.name}
              </Button>

              {results[func.name] && (
                <div className="mt-4 p-4 bg-slate-100 rounded">
                  <pre className="text-sm">
                    {JSON.stringify(results[func.name], null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}