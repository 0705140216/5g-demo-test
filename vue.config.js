const { name } = require('./package')
const { IgnorePlugin } = require('webpack')
const resolve = dir => require('path').join(__dirname, dir)

const isProd = process.env.NODE_ENV === 'production'
const title = '5g测试专用' // page title
const port = 9999 // dev port

module.exports = {
  publicPath: './',
  outputDir: process.env.outputDir,
  assetsDir: 'static',
  filenameHashing: true,
  productionSourceMap: process.env.VUE_APP_PREVIEW === 'true', // disable source map in production
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  lintOnSave: false,
  configureWebpack: {
    plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],
    resolve: {
      alias: {
        '@': resolve('src'),
        _com: resolve('src/components'),
        _api: resolve('src/api'),
        _views: resolve('src/views')
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload').delete('prefetch')

    config.plugin('html').tap(args => {
      args[0].title = title
      return args
    })

    config.when(isProd, config => {
      config
        .plugin('CompressionWebpackPlugin')
        .use(require('compression-webpack-plugin'), [
          {
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240, // 资源文件大于10240B=10kB时会被压缩
            minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩
          }
        ])
        .end()

      // 对基础类库、UI组件单独拆包，以更好利用客户端做持久化缓存
      config.optimization.splitChunks({
        chunks: 'all',
        automaticNameDelimiter: '-', // 自定义定义文件名称连接符，默认~
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          antd: {
            name: 'chunk-antd',
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/,
            priority: 20
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#6A76DD',
          // 'link-color': '#1DA57A',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('src/assets/styles/variables.less')]
    }
  },
  devServer: {
    hot: true,
    port,
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: 'http://192.168.1.171:8088'
  }
}
