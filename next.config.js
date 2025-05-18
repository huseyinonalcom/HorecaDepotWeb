const nextTranslate = require("next-translate-plugin");

module.exports = nextTranslate({
  staticPageGenerationTimeout: 300,
  async redirects() {
    return [
      {
        source: "/stock",
        destination: "/stock/list/all",
        permanent: true,
      },
    ];
  },
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
