/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: './build', // Changes the build output directory to `./dist`.
    experimental: {
        serverActions: {
            allowedOrigins: ["card.dn11.baimeow.cn"],
        },
    },
  }
   
  export default nextConfig
