module.exports = {
    presets: ['next/babel', '@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
    plugins: [
        ['import', { libraryName: 'antd', style: true }, 'antd'],
        [
            'import',
            { libraryName: '@ant-design/icons', libraryDirectory: 'es/icons', camel2DashComponentName: false },
            'ant-design-icons',
        ],

        '@babel/plugin-transform-runtime',
    ],
};
        ['styled-components', { ssr: true, displayName: true, preprocess: false }],
    ],
};
