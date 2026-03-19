const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  // Enable dependency transpilation
  publicPath: process.env.NODE_ENV === "production" ? "/gvd/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: "warning",

  // Configure Webpack
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },

  // Configure Development Server
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_JSONAPI_BASE_URL || "https://gvd.wustl.edu",
        changeOrigin: true,
        secure: false,
      },
      "/jsonapi": {
        target: process.env.VUE_APP_JSONAPI_BASE_URL || "https://gvd.wustl.edu",
        changeOrigin: true,
        secure: false,
      },
      "/solr_gvd": {
        target:
          process.env.VUE_APP_API_BASE_URL || "https://talus.artsci.wustl.edu",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
