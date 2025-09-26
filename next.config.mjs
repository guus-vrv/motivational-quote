// next.config.mjs
/** @type {import('next').NextConfig} */

const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/generate',
          permanent: true, // use false if you might change later
        },
      ];
    },
  };
  
  export default nextConfig;
  