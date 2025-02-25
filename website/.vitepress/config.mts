import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import leftbar from "../_leftbar.json";
import topbar from "../_topbar.json";

const sitename = "Baklava"
const sitegithub = "cachiusa/baklava"
const sitebase = "/baklava/"

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: sitename,
    description: "A community-driven wiki of the Android Platform",

    srcDir: "docs",
    cleanUrls: true,

    base: sitebase,

    head: [
        ["link", { rel: "icon", href: `${sitebase}favicon.svg` }]
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
        logo: "/icons/studio_platform.svg",

        nav: topbar,

        search: {
            provider: "local",
        },

        editLink: {
            pattern: `https://github.com/${sitegithub}/edit/main/docs/:path`
        },

        lastUpdated: {
            formatOptions: {
                dateStyle: "short",
                timeStyle: undefined
            }
        },

        sidebar: leftbar,

        externalLinkIcon: true,

        socialLinks: [
            { icon: "github", link: `https://github.com/${sitegithub}` },
        ],

        outline: "deep",
    }
});
