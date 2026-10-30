module.exports = {
  developer: [
    'intro',
    'quickstart',
    'download',
    {
      type: 'category',
      label: 'HTTP API',
      items: ['api/overview', 'api/profiles', 'api/rpa', 'api/plugins'],
    },
    {
      type: 'category',
      label: '自动化插件',
      items: ['plugins/overview', 'plugins/go-sdk', 'plugins/workflow-authoring', 'plugins/manifest', 'plugins/node-schema', 'plugins/protocol', 'plugins/capabilities'],
    },
    'security',
    'compatibility',
  ],
};
