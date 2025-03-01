# Nextra

Nextra is a Next.js plugin that renders your **MDX files** with custom themes.

## Development

### Installation

The Nextra repository uses [PNPM Workspaces](https://pnpm.io/workspaces) and [Lerna](https://github.com/lerna/lerna). To install dependencies, just simply run `pnpm` in the project root directory.

### Build Nextra Core

```bash
cd packages/nextra
pnpm build
```

Watch mode: `yarn dev`

### Build Nextra Theme

```bash
cd packages/nextra-theme-docs
pnpm build
```

Watch mode: `pnpm dev`
Watch mode (layout only): `pnpm dev:layout`
Watch mode (style only): `pnpm dev:tailwind`

### Development

You can also debug them toegther with a website locally. For instance, to start examples/docs locally, run

```bash
cd examples/docs
pnpm dev
```

Any change to example/docs will be re-rendered instantly.

If you update the core or theme packages, a rebuild is required. Or you can use the watch mode for both nextra and the theme in separated terminals.
