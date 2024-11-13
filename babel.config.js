// babel.config.js
module.exports = {
    presets: ['next/babel'],
    plugins: [
        ['import', { libraryName: 'antd', style: true }, 'antd'],
        [
            'import',
            { libraryName: '@ant-design/icons', libraryDirectory: 'es/icons', camel2DashComponentName: false },
            'ant-design-icons',
        ],
    ],
};
        