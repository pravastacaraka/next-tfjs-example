const { _app_config } = require("./app.config");

/** @type {import('next-sitemap').IConfig} */
const _sitemap_config = {
  changefreq: "daily",
  priority: 0.7,
  siteUrl: _app_config.siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};

module.exports = Object.freeze(_sitemap_config);
