## Why

現在のワークフローは、`sites/*.yml` に登録した個別 URL を raw / ja / state で管理するところまではできているが、`mise.jdx.dev` の公式ドキュメント全体を対象にページ一覧を収集し、まとめて翻訳管理する仕組みはまだない。`mise` をこのプロジェクトの最初の実サイト対象として完走できる状態にするため、サイト全体を扱う change が必要である。

## What Changes

- `mise.jdx.dev` の公式ドキュメント配下から翻訳対象ページを列挙するワークフローを追加する
- `sites/mise.yml` に、サイト全体を対象とする収集スコープと除外ルールを定義できるようにする
- 列挙したページ群を `data/raw/mise/` と `data/ja/mise/` に一貫した path で保存できるようにする
- `data/state/mise.json` に、ページ一覧、処理状態、スキップ理由を含む site-wide な追跡情報を記録できるようにする
- `mise` の sample を単一ページ例から、公式ドキュメント全体を扱う運用例へ拡張する

## Capabilities

### New Capabilities
- `site-page-discovery`: サイト設定に基づいて、翻訳対象ページ一覧を列挙・正規化・除外できることを扱う
- `site-wide-translation-batch`: 列挙済みページ群を raw / translated / state にまとめて反映することを扱う

### Modified Capabilities
- `site-config-registry`: entry URL だけでなく、サイト全体の収集スコープ、除外パターン、公式ドキュメントの対象範囲を定義できるようにする
- `translation-state-tracking`: site-wide 処理で発見したページの状態、未取得、翻訳済み、スキップ理由を追跡できるようにする

## Impact

- `sites/mise.yml` の設定項目拡張
- `data/raw/mise/`、`data/ja/mise/`、`data/state/mise.json` の運用ルール拡張
- ページ一覧収集、対象判定、state 更新を担う実装追加
- `mise` 公式ドキュメントを使った検証データと確認手順の追加
