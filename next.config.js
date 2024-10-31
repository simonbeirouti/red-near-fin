/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  transpilePackages: ["@repo/ui", "@repo/theme", "@repo/near", "@repo/mintbase", "@repo/icons"],
  experimental: {
    externalDir: true
  }
}

module.exports = nextConfig 