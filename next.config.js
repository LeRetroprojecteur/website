/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

const nextConfig = {
  pwa: {
    reloadOnOnline: false,
  },
  output: "standalone",
};

module.exports = withPWA(nextConfig);
