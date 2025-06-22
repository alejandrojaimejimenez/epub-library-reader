module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { 
        node: 'current',
        browsers: '> 0.25%, not dead'
      }
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      importSource: 'react'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx', { 
      runtime: 'automatic' 
    }],
    ['@babel/plugin-proposal-class-properties', { 
      loose: true 
    }],
    ['@babel/plugin-transform-private-property-in-object', { 
      loose: true 
    }],
    ['@babel/plugin-transform-private-methods', { 
      loose: true 
    }]
  ]
};
