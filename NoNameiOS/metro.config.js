const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      if (req.url === '/keyboard-shortcuts') {
        const shortcuts = {
          reload: '0',
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