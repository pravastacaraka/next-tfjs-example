const _app_config = Object.freeze({
  domain: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  siteUrl: `https://${process.env.NEXT_PUBLIC_SITE_URL}`,
});

/** @type {import("next").Metadata} */
const _app_metadata = {
  title: {
    default: "Tensorflow.js Example",
    template: "%s | Tensorflow.js Example",
  },
  description: `This object detection project uses the YOLOv5 model which has been converted to Tensorflow.js format for edge computing.`,
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  themeColor: "ffffff",
  manifest: "/favicon/site.webmanifest",
  authors: {
    name: "Pravasta Caraka Bramastagiri",
    url: "https://pravastacaraka.my.id",
  },
};

module.exports = { _app_config, _app_metadata };
