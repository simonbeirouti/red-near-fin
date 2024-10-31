#!/bin/bash

# Exit on error
set -e

echo "🏗 Building NEAR contract..."

# Navigate to the contracts directory (adjust path as needed)
cd ./apps/contracts

# Clean the contract
cargo clean

# Create near build
cargo near build --no-docker

echo "✅ Contract built successfully"

# Create public contracts directory if it doesn't exist
mkdir -p ../docs/public/contracts

# Copy the ABI file
echo "📋 Copying ABI file..."
cp target/near/*_contract_abi.json ../docs/public/contracts/

echo "🎉 Done! ABI file copied to public/contracts/" 