const nextTranslate = require("next-translate-plugin");

module.exports = nextTranslate({
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdapi.huseyinonalalpha.com",
      },
      {
        protocol: "https",
        hostname: "hdcdn.hocecomv1.com",
      },
    ],
  },
});
