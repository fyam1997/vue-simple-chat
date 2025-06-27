## create project

```shell
gcloud projects create vue-simple-chat-20250627 --name="Vue Simple Chat"
```

```shell
gcloud projects list
```

```shell
gcloud config set project vue-simple-chat-20250627
```

## enable drive api

```shell
gcloud services enable drive.googleapis.com
```

## oauth client

there will be so much tribble to create oauth client by
cli ([ref](https://cloud.google.com/iap/docs/programmatic-oauth-clients)).

[create in GCP console](https://console.cloud.google.com/apis/credentials)

1. create consent screen in https://console.cloud.google.com/auth/overview
2. create credentials -> oauth client id in https://console.cloud.google.com/apis/credentials
3. application type: web application
4. Authorized JavaScript origins: http://localhost:5173 for vue local dev (no need redirect URI if using popup auth)
5. [audience](https://console.cloud.google.com/auth/audience), publish or add test user

