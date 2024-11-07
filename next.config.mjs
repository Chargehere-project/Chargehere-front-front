const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['antd', 'rc-util', '@ant-design', 'rc-pagination', 'rc-picker'],
    experimental: {
        esmExternals: 'loose',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '3.36.65.201',
                port: '8000',
                pathname: '/uploads/**',
            }
        ],
    },
};

export default nextConfig;