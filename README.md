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

[//]: # (TODO add switch, to control a msg sent or not)

[//]: # (TODO fold adjacent disabled msg?)

[//]: # (TODO add branch button)

[//]: # (TODO keyboard navigation)

[//]: # (TODO download with chat name)

[//]: # (TODO lock a chat, all comming msg will be single ans)

[//]: # (TODO refactor msg list modification, send a Operation, better for undo)
