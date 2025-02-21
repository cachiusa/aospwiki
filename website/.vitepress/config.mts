import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import leftbar from "../_leftbar.json";
import topbar from "../_topbar.json";

const sitename = "Baklava"
const siterepo = "baklava"
const siteslug = `/${siterepo}`

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: sitename,
    description: "",

    srcDir: "docs",
    cleanUrls: true,

    base: `${siteslug}/`,

    head: [
        ["link", { rel: "icon", href: `${siteslug}/asfp.svg` }]
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
            pattern: `https://github.com/cachiusa/${siterepo}/edit/main/docs/:path`
        },

        lastUpdated: {
            formatOptions: {
                dateStyle: "short",
                timeStyle: "short"
            }
        },

        sidebar: leftbar,

        externalLinkIcon: true,

        socialLinks: [
            { icon: "github", link: `https://github.com/cachiusa/${siterepo}` },
        ],

        outline: "deep",
    }
});
