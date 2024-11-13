// next.config.js
const withTM = require('next-transpile-modules')(['@ant-design/icons', '@ant-design/icons-svg', 'rc-util']);

module.exports = withTM({
    compiler: {
        styledComponents: true,
    },
    experimental: {
        esmExternals: true, // ESM 외부 모듈을 완전히 허용
    },
});
