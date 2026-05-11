/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://usfinancetools.com/financetools",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.6,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  transform: async (config, path) => {
    let priority = 0.6;
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.split("/").length === 2 && !path.includes(".")) {
      // Category pages like /mortgage
      priority = 0.8;
      changefreq = "weekly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
