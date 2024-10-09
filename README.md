# 交通費精算ツール

## 概要

毎月の交通費を精算するためのツール。  
各ワークスペースごとに申請者と承認者がおり、WEB アプリ上で申請・承認・帳票出力を完結できる。

## 開発背景

以前に所属していた会社で交通費を精算するときに以下のように手間が多かった。

- Excel を使用し所定のフォーマットで交通費を入力する。
- 入力した内容を PDF 出する。
- 別途ワークフローアプリに PDF を添付して交通費申請する。
- ワークフローアプリで承認する。
- 帳票を手渡しでもらう。

この手間をなくし、上記の工程を 1 つの場所(web)で完結させたかった。

また、React、Node.js、Typescript の勉強も兼ねている。

## 技術スタック

### フロントエンド

- React
- Typescript
- Tailwind CSS
- Shadcn(React UI ライブラリ)

### バックエンド

- Node.js(Typescript)
- Express.js(WEB フレームワーク)
- prisma(ORM)

### その他

- PostgreSQL
- Redis
- Heroku
- Git/GitHub
- GitHub Actions

## 機能一覧

## システム構成

![alt text](docs/システム構成図.drawio.svg)

## 画面一覧

![alt text](docs/画面一覧.svg)

## DB 設計

![alt text](docs/ER図.drawio.svg)
