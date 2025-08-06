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

[//]: # (TODO should focus to input box when start new chat)

[//]: # (TODO added chat create time, default chat name should be empty, show date if empty, if empty, next send msg generate title)

[//]: # (TODO title should directly update target index, not current index)

[//]: # (TODO hide menu after click input menu, except checkbox)

[//]: # (TODO title should not have markdown format)

[//]: # (TODO like loading manager, should have a db value manager, observe each key, remove observer when killed)

[//]: # (TODO add a change log)
