export default {
  // "presets": [
  //   ["@babel/preset-env", {
  //     "targets": {
  //       "node": "current"
  //     }
  //   }],
  //   "@babel/preset-react"
  // ],
  "plugins": [
    ["module-resolver", {
      "root": ["./"],
      "alias": {
        "@": "./src",
        "@microlight/local":"./"
      }
    }],
    "@babel/plugin-syntax-jsx"
  ],
  "ignore": ["../src/tasks/**/*"] // relative to this file location
  
  // "sourceMaps": true,
  // "sourceRoot": "./src",
  // "outDir": "./dist"
} 