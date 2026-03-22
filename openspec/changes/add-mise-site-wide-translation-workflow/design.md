## Context

現在の実装は、`sites/*.yml` に記載された `entry_urls` を読み取り、個別ページを `data/raw/<site>/`、`data/ja/<site>/`、`data/state/<site>.json` で管理する bootstrap まで完了している。`mise` では `tasks` と `environments` の sample を扱えているが、公式ドキュメント全体を翻訳対象として取り込むには、どのページを対象にするかをサイト全体から列挙し、対象外ページを除外し、ページ群を state で一括管理する仕組みが不足している。

今回の change では、最初の site-wide 対象を `mise.jdx.dev` に限定し、VitePress ベースの公式ドキュメント配下を前提に進める。ブログ、外部サイト、GitHub 編集リンク、検索 UI などは対象外とし、まずは「公式ドキュメント本文ページを raw / ja / state へ落とせる」ことを目標にする。

## Goals / Non-Goals

**Goals:**
- `sites/mise.yml` に、サイト全体を収集するためのスコープ設定と除外ルールを表現できるようにする
- `mise.jdx.dev` から公式ドキュメント本文ページ一覧を列挙し、重複のない正規化済み URL リストを得られるようにする
- 列挙したページ群を raw / ja / state に一貫した path で反映できるようにする
- state に、各ページの状態、保存先、スキップ理由を記録できるようにする

**Non-Goals:**
- `mise` 以外のサイトへの一般化
- 差分クロールや更新追従の自動最適化
- GitHub Pages 用のナビゲーション生成
- ブログ、ニュース、外部リンク、API リファレンス以外の周辺ページまで含む収集

## Decisions

### 1. `sites/mise.yml` にサイト全体の収集ルールを持たせる

`entry_urls` は維持しつつ、追加で「許可 path prefix」「除外 path prefix」「除外 URL pattern」を設定できる前提にする。これにより、サイト固有ロジックをコードへ焼き込まずに `mise` の公式 docs 範囲を設定ファイルで決められる。

代替案:
- コード側に `mise.jdx.dev` 専用の除外ルールを埋め込む
  - 実装は速いが、設定ファイルを正本とする既存方針に反するため採用しない

### 2. ページ発見は HTML 内リンクの走査で始める

初期実装では sitemap 依存にせず、`entry_urls` から辿れる内部リンクを収集してページ一覧を作る。`allowed_domains` と path ルールで公式 docs 範囲に絞る。これで `mise` の VitePress サイトでは十分な coverage を見込める。

代替案:
- sitemap.xml や VitePress の build artifact を直接読む
  - より効率的な可能性はあるが、サイト構造に依存しやすく汎用性が落ちるため初手では採用しない

### 3. state は「ページ一覧の正本」として扱う

列挙で見つかった各ページは `data/state/mise.json` に記録し、`discovered` / `raw-only` / `translated` / `skipped` のような状態を持たせる。raw / ja の保存有無だけでなく、意図的に除外した理由も記録対象にする。

代替案:
- 発見一覧は別ファイル、翻訳状態は state で分離する
  - 追跡情報が二重化しやすく、レビュー対象が分散するため採用しない

### 4. まずは原作準拠のページ単位成果物を優先する

翻訳結果は既存ルール通り `data/ja/mise/...` にページ単位で保存し、見出し・表・コードブロック・metadata を保持する。サイト全体対応になっても、ページをまとめて1ファイル化しない。

代替案:
- セクション単位やサイト単位の結合出力
  - GitHub Pages 側では便利だが、原作準拠と source traceability を損なうため今回は扱わない

## Risks / Trade-offs

- [Risk] `mise` サイト内には docs 以外の内部リンクもある → Mitigation: path prefix と URL pattern の両方で対象範囲を制限する
- [Risk] すべてのページを一度に翻訳すると作業量が大きい → Mitigation: まずはページ発見と raw/state の確定を先に終え、翻訳は state を使って段階投入できる設計にする
- [Risk] VitePress の UI 要素が本文抽出に混ざる → Mitigation: sample ページ群で本文領域の抽出ルールを検証し、ノイズ要素の除外を state notes に残す
- [Risk] 既存 bootstrap の検証が `tasks` 単一ページ前提に寄る → Mitigation: `mise` の複数ページ sample を前提に verify を拡張する
