module.exports = {
    presets: ['next/babel'],
    plugins: [
        ['import', { libraryName: 'antd', style: true }, 'antd'],
        [
            'import',
            { libraryName: '@ant-design/icons', libraryDirectory: 'es/icons', camel2DashComponentName: false },
            'ant-design-icons',
        ],
        ['styled-components', { ssr: true, displayName: true, preprocess: false }],
    ],
};