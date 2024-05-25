import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
import type { Config } from 'tailwindcss';

const config = {
  experimental: {
    optimizeUniversalDefaults: true
  },
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve(
        '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ["Quicksand"]
      }
    },
  },
  plugins: [
    skeleton
  ]
} satisfies Config;

export default config;
