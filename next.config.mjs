/**
  @type {import('next').NextConfig}
 */
  const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['antd', 'rc-util', '@ant-design', 'rc-pagination', 'rc-picker'],
    experimental: {
        esmExternals: 'loose',
    },
    images: {
        domains: ['localhost'],  // 이미지를 가져올 도메인 추가
        // remotePatterns 옵션을 사용하면 더 세밀한 설정 가능
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;