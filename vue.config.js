module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/app/'
    : '/',
  configureWebpack: {
    resolve: {
      fallback: {
        querystring: require.resolve('querystring-es3'),
        url: require.resolve('url/'),
      },
    },
  },
  css: {
    loaderOptions: {
      css: {
        url: false,
      },
    },
  },
}
