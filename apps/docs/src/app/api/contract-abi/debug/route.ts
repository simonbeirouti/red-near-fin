import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const currentDir = process.cwd();
  const workspaceRoot = path.resolve(currentDir, '..', '..');
  const contractsPath = path.join(workspaceRoot, 'contracts', 'target', 'near');
  
  // List of paths to check
  const pathsToCheck = [
    currentDir,
    workspaceRoot,
    path.join(workspaceRoot, 'contracts'),
    path.join(workspaceRoot, 'contracts', 'target'),
    contractsPath
  ];

  const pathInfo = pathsToCheck.map(p => ({
    path: p,
    exists: existsSync(p),
    contents: existsSync(p) ? readdirSync(p) : null
  }));

  return NextResponse.json({
    paths: pathInfo,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      cwd: process.cwd(),
    }
  });
}