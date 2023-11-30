# xApp
## XRPL DeFi 分散型無尽講

ダウンロードしてディレクトリに移動

```bash

gh repo clone xrpshhh/demo-repository
cd xApp

```

パッケージのインストール

```bash

npm i

# or

yarn add

# or

pnpm add
```

環境変数にAPI KEYとシークレットを設定
.env.localを編集する

```.env:.env.local

XUMMAPI={Your API Key}
XUMMSECRET={Your Secret}

```
TESTNET用のアドレスを使う場合　

https://xrpl.org/xrp-testnet-faucet.html から作成

Your Testnet Credentials

- Address:
rapQqDRvY7WxGZLk1KnRRXVycFZD4VW2yw

- Secret:
sEdThei83qwiNKtcmM2gquBoz7XZ1Gp

- Balance:
10,000 XRP

- Sequence Number:
43321922


```

ローカルで実行する
デフォルトは http://localhost:3000

```bash

npm run dev

# or

yarn dev

# or

pnpm dev

```

Cloudflare Pagesにデプロイ(edge runtimeを使用)

```bash

npm run pages@deploy

```

Dockerでデプロイする場合(開発はローカル推奨)

```bash

docker compose up

```

## Reference Docs
### [xrpl.org](https://xrpl.org/protocol-reference.html)
- xrplの公式サイト
### [xrpl.js](https://js.xrpl.org)
- xrplのクライアントライブラリ
### [Xumm Developer](https://docs.xumm.dev/)
- xumm sdk, xappの開発用
### [XRPL Hooks](https://xrpl-hooks.readme.io/)
- xrplの新機能のHooks(スマートコントラクト)
### [XRPL Standards](https://github.com/XRPLF/XRPL-Standards/discussions)
- xrplの新機能についての提案や仕様のディスカッション
### [crossmark](https://docs.crossmark.io/)
- ブラウザ拡張機能のxrp wallet


### [Next.js](https://nextjs.org/docs)
- バックエンドも使えるreactの多機能フレームワーク
### [cloudflare pages](https://developers.cloudflare.com/pages/)
- 静的サイトまたはサーバーレスのデプロイ先のプラットフォーム
### [tailwindcss](https://tailwindcss.com/docs/installation)
- cssをインラインスタイルで記述できてnextjsと相性が良い
### [daisyUI](https://daisyui.com/components/)
- tailwindcssのコンポーネントが用意されていてレスポンシブ対応
### [next auth](https://next-auth.js.org/)
- Oauthライブラリで多数のプラットフォームに対応
### [i18n](https://www.i18next.com/)
- 多言語対応のライブラリ
