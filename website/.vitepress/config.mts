import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import leftbar from "../docs/_leftbar.json";
import topbar from "../docs/_topbar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "AOSPWiki",
    description: "",

    srcDir: "docs",
    cleanUrls: true,

    base: '/aospwiki/',

    head: [
        ['link', { rel: 'icon', href: '/aospwiki/asfp.svg' }],
        ['style',
            { type: "text/css" },
            `.imgdesc { text-align:center;color:grey;font-style:italic; }`
        ]
    ],

    markdown: {
        config(md) {
            md.use(tabsMarkdownPlugin);
        },
    },

    vite: {
        resolve: {
            preserveSymlinks: true,
        },
    },

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/asfp.svg",

        nav: topbar,

        search: {
            provider: "local",
        },

        editLink: {
            pattern: "https://github.com/cachiusa/aospwiki/edit/main/docs/:path"
        },

        lastUpdated: {
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        },

        sidebar: leftbar,

        externalLinkIcon: true,

        socialLinks: [
            { icon: "github", link: "https://github.com/cachiusa/aospwiki" },
        ],

        outline: "deep",
    }
});
