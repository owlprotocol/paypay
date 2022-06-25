# React Vite Starter

## Packages
This monorepo is configured for the following projects:
* `packages/demo-app` React App bundled with Vite
* `packages/demo-components` React Components bundled with Vite

## PNPM Install
```
npm i -g pnpm
pnpm i
```
## StorybookJS
Both repositories support storbyook configured using the [storybook-for-vite](https://storybook.js.org/blog/storybook-for-vite/) blog post.

https://github.com/eirslett/storybook-builder-vite

## Library Mode
The `packages/demo-components` projects bundles UI components to be consumed by another React App project.

If looking to build a component library. You will need to use the [library mode](https://vitejs.dev/guide/build.html#library-mode) build option and update the [vite.config.ts](/vite.config.ts) accordingly. See the commented out "Library Mode" sections in that file.
