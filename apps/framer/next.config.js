//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  async rewrites() {
    return [
      {
        "source": "/f/poop",
        "destination": "http://@NEXT_PUBLIC_API_FRAMER_URL/f/poop"
      },
      {
        "source": "/f/123/",
        "destination": "@NEXT_PUBLIC_API_FRAMER_URL/f/123"
      },
      {
        "source": "/api/:path*",
        "destination": "http://ec2-54-224-175-29.compute-1.amazonaws.com/:path*"
      }
    ]
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
