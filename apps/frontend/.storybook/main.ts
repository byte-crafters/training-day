import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = typeof __dirname !== 'undefined' 
  ? __dirname 
  : path.dirname(fileURLToPath(import.meta.url));

// Получаем путь к корню frontend (на уровень выше .storybook)
const frontendRoot = path.resolve(dirname, '..');

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Исключаем onboarding MDX файл, который вызывает проблемы с резолвингом в pnpm
    "../src/**/*.mdx",
    "!../src/stories/Configure.mdx"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@training-day/shared": path.resolve(frontendRoot, "../../packages/shared/src"),
        },
        dedupe: ['react', 'react-dom'],
      },
    });
  },
};
export default config;