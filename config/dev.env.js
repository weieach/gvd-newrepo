"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

// module.exports = merge(prodEnv, {
//     NODE_ENV: '"development"',
//     protocol: '"http"',
//     host: '"localhost"',
//     path: '"solr/gvd"'
// })

// module.exports = merge(prodEnv, {
//     NODE_ENV: '"development"',
//     protocol: '"http"',
//     host: '"localhost:8983"',
//     path: '"solr/gvd"'
// });

module.exports = {
  NODE_ENV: '"production"',
  protocol: '"https"',
  host: "talus.artsci.wustl.edu",
  path: '"solr_gvd"'
};
