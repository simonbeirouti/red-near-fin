/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from 'tailwindcss';

import baseConfig from '@repo/tailwind';

export default {
  content: baseConfig.content,
  presets: [baseConfig],
} satisfies Config;