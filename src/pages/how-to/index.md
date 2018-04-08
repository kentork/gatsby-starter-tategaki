---
title: Gatsby 縦書きブログの始め方
date: 2018-02-22T22:22:22
---

# 1. テンプレートをクローンしてくる

```bash
$ git clone https://github.com/kentork/gatsby-starter-tategaki
```

# 2. プロジェクトのセットアップ

```bash
$ npm install
```

# 3. ブログ情報を書き換える

`gatsby-condig.js` の中の `siteMetadata` を書き換える。

# 4. 開発サーバを立ち上げる

```bash
$ npm run dev
```

# 5. ビルド

```bash
$ npm run build
```

# デプロイ

ビルド生成物 (`public/ 以下`) を配置できればどこでも OK。
