// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Alova.JS',
  tagline:
    'According to different request scenarios, we provide targeted request strategies to improve application fluency and availability, reduce server pressure, and enable applications to have excellent strategic thinking like a wise man',
  url: 'https://alova.js.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alovajs', // Usually your GitHub org/user name.
  projectName: 'alova', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB'
      }
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/alovajs/alovajs.github.io/blob/main/'
        },
        // disable blog
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'alova.JS',
        logo: {
          alt: 'ALOVA',
          src: 'img/logo.png'
        },
        items: [
          {
            type: 'doc',
            docId: 'get-started/overview',
            position: 'left',
            label: 'Guide'
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'localeDropdown',
            docId: 'locale',
            position: 'right'
          },
          {
            href: 'https://github.com/alovajs/alova',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Guide',
                to: '/get-started/overview'
              }
            ]
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/alovajs/alova'
              },
              {
                label: 'Issues',
                href: 'https://github.com/alovajs/alova/issues'
              },
              {
                label: 'Pull request',
                href: 'https://github.com/alovajs/alova/pulls'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} alova.js Team`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    }),

  // 插件
  plugins: [
    [
      './plugin/baiduStatistics',
      {
        id: '5afa4c96fca09cb386951b736ee31e56'
      }
    ]
  ]
};

module.exports = config;
