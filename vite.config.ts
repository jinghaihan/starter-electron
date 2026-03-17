import { rmSync } from 'node:fs'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

export default defineConfig(({ command }) => {
  const isServe = command === 'serve'
  const isBuild = command === 'build'

  // @ts-expect-error it's ok
  const external = Object.keys(pkg.dependencies || {})

  rmSync('dist-electron', { recursive: true, force: true })

  return {
    plugins: [
      Vue(),
      Icons({ compiler: 'vue3' }),
      // https://github.com/electron-vite/vite-plugin-electron
      Electron({
        main: {
          entry: 'electron/main/index.ts',
          vite: {
            build: {
              sourcemap: isServe,
              minify: isBuild,
              rolldownOptions: {
                external,
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: isServe ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external,
              },
            },
          },
        },
        renderer: {},
      }),
    ],
  }
})
