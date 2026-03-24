/** @type {import('next').NextConfig} */


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'backendweb-1-i696.onrender.com',
            },
        ],
    },
};


export default nextConfig;
