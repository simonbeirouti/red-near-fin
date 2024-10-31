#!/bin/bash

# Load environment variables from .env file if it exists
if [ ! -f ./env ]; then
    echo "⚠️ Warning: .env file not found"
else
    source .env
fi

# Check if NEXT_PUBLIC_CONTRACT_ADDRESS is set
if [ -z "$NEXT_PUBLIC_CONTRACT_ADDRESS" ]; then
    echo "❌ Error: NEXT_PUBLIC_CONTRACT_ADDRESS environment variable is not set"
    exit 1
fi

# Exit on error and handle errors
set -e
trap 'echo "❌ Error occurred. Exiting..."; exit 1' ERR

echo "🏗 Building NEAR contract..."

# Navigate to contracts directory and build
cd ./apps/contracts || exit 1
cargo clean || { echo "❌ Failed to clean contract"; exit 1; }
cargo near build --no-docker || { echo "❌ Failed to build contract"; exit 1; }
echo "✅ Contract built successfully"

# Deploy contract
cargo near deploy "$NEXT_PUBLIC_CONTRACT_ADDRESS" --no-docker without-init-call network-config testnet sign-with-keychain send || {
    echo "❌ Failed to deploy contract"
    exit 1
}
echo "✅ Contract deployed successfully"

# Copy ABI file
echo "📋 Copying ABI file..."
mkdir -p ../docs/public/contracts || { echo "❌ Failed to create contracts directory"; exit 1; }
cp target/near/*_contract_abi.json ../docs/public/contracts/ || { echo "❌ Failed to copy ABI file"; exit 1; }

echo "🎉 Done! ABI file copied to public/contracts/"