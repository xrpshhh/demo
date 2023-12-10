/** @type {import('next').NextConfig} */

const gateway = 'https://ipfs.io/ipfs/'
const cid = 'QmW3xdsxWa1brei8MNnL2VwP3UXFgsrGwiJVnbsYPp7vMG'
const ipfs = `${gateway}${cid}`

module.exports = {
  output: 'standalone',
  images: {
    loader: 'custom',
    unoptimized: true,
  },
  env: {
    XUMMAPI: process.env.XUMMAPI,
    XUMMSECRET: process.env.XUMMSECRET,
  },
  async rewrites() {
    return [
      {
        source: '/public/:file*',
        destination: `${ipfs}/:file*`,
      },
    ];
  },
};
