module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    check: true,
    reactDocgen: false,
  },
  webpackFinal: async (config) => {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

    // Ensure babel-loader processes story files
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      include: /stories/,
      use: [{
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
            require.resolve('@babel/preset-typescript')
          ]
        }
      }]
    });

    // Add TypeScript type checking
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: require('path').resolve(__dirname, '../stories/tsconfig.json'),
        },
      })
    );

    return config;
  },
};
