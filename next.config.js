/** @type {import('next').NextConfig} */
const gateway = 'https://ipfs.io/ipfs/'
// const gateway = 'https://cloudflare-ipfs.com/ipfs/'
const cid = 'bafybeidwkwodllbzo35ggin25uqvl2aoho6qlslmlvdey73ufy6dcaify4'
const ipfs = `${gateway}${cid}`

module.exports = {
  // output: 'standalone',
  swcMinify: false,
  images: {
    loader: 'custom',
    unoptimized: true,
  },
  env: {
    XUMMAPI: process.env.XUMMAPI,
    XUMMSECRET: process.env.XUMMSECRET,
    WS_URI: process.env.WS_URI,
    ORIGIN: process.env.ORIGIN,
  },
  async rewrites() {
    return [
      {
        source: '/ipfs/:file*',
        destination: `${ipfs}/:file*`,
      },
    ];
  },
};
