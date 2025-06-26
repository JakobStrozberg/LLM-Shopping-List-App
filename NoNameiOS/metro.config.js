const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure Metro bundler options
config.server = {
  ...config.server,
  // Configure keyboard shortcuts
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      if (req.url === '/keyboard-shortcuts') {
        // Override keyboard shortcuts
        const shortcuts = {
          reload: '0',  // Changed from 'r' to '0'
          devMenu: 'd',
          elementInspector: 'i',
          performanceMonitor: 'p'
        };
        res.json(shortcuts);
        return;
      }
      return middleware(req, res, next);
    };
  }
};

module.exports = config; 