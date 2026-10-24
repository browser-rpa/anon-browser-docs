const config = {
  title: 'anon-browser 开发者中心',
  tagline: '可下载的本地隔离浏览器客户端与开发者文档',
  favicon: 'img/favicon.svg',
  url: 'https://browser-rpa.github.io',
  baseUrl: '/anon-browser-docs/',
  organizationName: 'browser-rpa',
  projectName: 'anon-browser-docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'zh-CN', locales: ['zh-CN', 'en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/browser-rpa/anon-browser-docs/edit/main/',
        },
        blog: false,
        pages: false,
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  themeConfig: {
    image: 'img/social-card.svg',
    navbar: {
      title: 'anon-browser 客户端文档',
      logo: { alt: 'anon-browser', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'developer', position: 'left', label: '文档' },
        { to: '/download', label: '下载客户端', position: 'left' },
        { href: 'https://github.com/browser-rpa/anon-browser-examples', label: '示例仓库', position: 'right' },
        { href: 'https://github.com/browser-rpa/anon-browser-docs', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: '开发', items: [{ label: '快速开始', to: '/quickstart' }, { label: '插件开发', to: '/plugins/overview' }] },
        { title: '参考', items: [{ label: 'HTTP API', to: '/api/overview' }, { label: '插件协议', to: '/plugins/protocol' }] },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} browser-rpa. Public developer documentation.`,
    },
    prism: { additionalLanguages: ['bash', 'go', 'json', 'yaml', 'http'] },
  },
};

module.exports = config;
