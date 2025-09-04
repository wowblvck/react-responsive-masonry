import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/**/*',
    }
  },
  lib: [
    {
      format: 'esm',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: "./dist/esm"
        }
      }
    },
    {
      format: 'cjs',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: "./dist/cjs"
        }
      }
    },
  ],
  output: {
    target: 'web',
    cleanDistPath: true,
    minify: true,
  },
  plugins: [
    pluginReact(),
  ],
});
