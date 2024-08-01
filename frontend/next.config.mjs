/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    },
};

export default nextConfig;
