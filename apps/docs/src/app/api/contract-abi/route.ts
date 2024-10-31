import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Look for ABI file in public/contracts directory
    const publicContractsPath = path.join(process.cwd(), 'public', 'contracts');
    
    if (!existsSync(publicContractsPath)) {
      return NextResponse.json(
        { 
          error: 'Contracts directory not found',
          message: 'Please run `pnpm build:contract` to generate the ABI file'
        },
        { status: 404 }
      );
    }

    const files = readdirSync(publicContractsPath);
    const abiFile = files.find(file => file.endsWith('_contract_abi.json'));
    
    if (!abiFile) {
      return NextResponse.json(
        { 
          error: 'No ABI file found',
          message: 'Please run `pnpm build:contract` to generate the ABI file'
        },
        { status: 404 }
      );
    }

    const abiContent = readFileSync(path.join(publicContractsPath, abiFile), 'utf-8');
    const abiJson = JSON.parse(abiContent);
    
    return NextResponse.json(abiJson);
  } catch (error) {
    console.error('Error loading contract ABI:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load contract ABI',
        details: error instanceof Error ? error.message : String(error),
        path: process.cwd()
      },
      { status: 500 }
    );
  }
}