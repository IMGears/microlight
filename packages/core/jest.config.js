export default {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    'src/**/*.{jsx,tsx}',
    '!src/**/*.model.js',
    '!src/database/**/*'
  ],
  "modulePathIgnorePatterns": ["dist"],
  // maxWorkers:1,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {
      presets: [
        ["@babel/preset-env", {
          targets: {
            node: "current"
          }
        }],
        ['@babel/preset-react', {
          runtime: 'automatic' // This enables the new JSX transform
        }]
      ],
      plugins: [
        ["module-resolver", {
          root: ["./"],
          alias: {
            "@": "./src"
          }
        }]
      ]
    }]
  }

  // ... other Jest configurations ...
}; 