# vue-simple-chat

https://fyam1997.github.io/vue-simple-chat/

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Compile and Minify for Production

```sh
pnpm run build
```

### Deployment

```sh
pnpm install
pnpm run build
gh-pages -d dist -m "$(git rev-parse HEAD)"
```

## Google sync api config

add `.env`, and GOOGLE_CLIENT_ID

## TODO

[//]: # (TODO keyboard navigation)

[//]: # (ctrl+up/down to navigate msgs, L to lock chat til current msg, enter to edit, ctrl)

[//]: # (TODO refactor msg list modification, send a Operation, better for undo. kind of like redux's action)

[//]: # (TODO undo, msg edit, removal? mobile undo? Undo stack, Each msg, on mount. Not focusing, undo deletion)

[//]: # (TODO Mock open ai api server)

[//]: # (TODO smart key, auto close \(\) "" '' ``````)

[//]: # (TODO extract all scroll controlling to separate view model)

[//]: # (TODO Chat and msg should have datetime, Edit time)

[//]: # (TODO Chat content sync)

[//]: # (TODO Sync save token)

[//]: # (TODO sync should show comparison)

[//]: # (TODO separate config manage and sync)

[//]: # (TODO extra data)

[//]: # (TODO Search finance data)

[//]: # (TODO Enum chat search fin)

[//]: # (TODO Tarvily search)

[//]: # (TODO Change to option api, accessing viewmodel.ref will buggy. looks i should not use ref in shared view model. or use piniajs?)

[//]: # (TODO Scrolling failed, loaded last scroll height, add delay can solve, but think a better way)

[//]: # (TODO msg should be in edit mode after inserted)

[//]: # (TODO separated loading)
