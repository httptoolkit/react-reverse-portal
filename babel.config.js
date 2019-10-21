module.exports = {
  env: {
    web: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'entry',
            modules: false,
            corejs: 3,
          },
        ],
      ]
    },
  },
};
