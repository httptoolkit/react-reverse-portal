module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  typescript: {
    check: true,
    reactDocgen: false,
  },
  async viteFinal(config) {
    const { default: checker } = await import('vite-plugin-checker');

    config.plugins = config.plugins || [];
    config.plugins.push(
      checker({
        typescript: {
          tsconfigPath: './stories/tsconfig.json',
        },
      })
    );

    return config;
  },
};
