// next.config.js
const withTM = require('next-transpile-modules')(['@ant-design/icons', '@ant-design/icons-svg', 'rc-util']);

module.exports = withTM({
    compiler: {
        styledComponents: true,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });
        return config;
    },
    experimental: {
        esmExternals: 'loose', // ESM 외부 모듈을 완전히 허용
    },
});
