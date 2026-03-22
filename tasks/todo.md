# Todo

## Plan

- [x] ユーザー提示の新しいプロジェクト概要をREADME向けに整理する
- [x] `README.md` を正本として更新する
- [x] `openspec/project.md` に概要を同期する
- [x] 差分を確認してレビュー結果を記録する

## Review

- `README.md` を、技術系サイトの日本語化、サイト別ディレクトリ保存、GitHub Pages 公開を目的とする概要へ更新した。
- `openspec/project.md` を README の内容に合わせて同期した。
- 更新追従は MVP ではなく拡張候補として位置づけた。

## Plan: mise-en-place 対応

- [x] `mise-en-place` を最初の検証サイトとして現行 OpenSpec change に反映する
- [x] `proposal.md` / `design.md` / `spec.md` / `tasks.md` に受け入れ前提を追加する
- [x] 差分を確認してレビュー結果を追記する

## Review: mise-en-place 対応

- 現行 OpenSpec change に `mise-en-place` を最初の検証対象として追加した。
- `proposal.md` と `design.md` に、`mise` を使う理由と代表URLによる受け入れ確認方針を追記した。
- `spec.md` に `mise.jdx.dev` を使った具体的な scenario を追加し、コードブロック保持と source traceability を明文化した。
- `tasks.md` に `mise` の代表ページを使った確認タスクを追加した。

## Plan: .mise.local.toml 追跡解除

- [x] `.mise.local.toml` を Git の追跡対象から外す
- [x] ignore 設定が意図どおり効く状態を確認する
- [x] 対応内容をコミットする

## Review: .mise.local.toml 追跡解除

- `git rm --cached .mise.local.toml` で Git の追跡対象から外した。
- `git check-ignore -v .mise.local.toml` で `.gitignore` の設定が有効であることを確認した。
- ローカルファイルは残したまま、今後は未追跡の ignore 対象として扱える状態にした。

## Plan: 単一URL翻訳CLI実装

- [x] `add-single-page-translation-cli` change に沿って CLI の骨組みを実装する
- [x] `fetch -> extract -> convert -> translate -> save` の基本パイプラインを実装する
- [x] `mise` の代表URL向け確認手順とテストを追加する
- [x] 実行検証を行い、結果と制約を記録する

## Review: 単一URL翻訳CLI実装

- `src/` に CLI、ページ取得、本文抽出、Markdown変換、翻訳、保存の各モジュールを追加した。
- `OPENAI_API_KEY` を使う翻訳処理と、frontmatter付き保存処理を実装した。
- `test/` にユニットテストを追加し、`pnpm test` で全件成功を確認した。
- `scripts/check-mise-pages.js` を追加し、`pnpm run check:mise` で `mise` の代表ページに対する抽出・変換確認を行った。
- 実行環境に `OPENAI_API_KEY` がないため、実際の日本語翻訳完了までは未確認で、CLI はその条件で明示的に失敗することを確認した。

## Plan: 要件再定義

- [x] 翻訳管理アプリとしての新しいワークフローを整理する
- [x] CLI 前提だった旧方針との差分を明確にする
- [x] 次に作る OpenSpec change のスコープを決める

## Review: 要件再定義

- CLI 前提の実装、検証スクリプト、旧 `single-page` change を削除した。
- `README.md`、`openspec/project.md`、`openspec/AGENTS.md` を、設定ファイル駆動の翻訳管理ワークフローに合わせて更新した。
- パッケージ設定を最小構成へ戻し、CLI 用 scripts と依存を外した。
- 次に必要なのは、サイト設定、raw 保存、ja 保存、状態追跡を扱う新しい OpenSpec change の作成だと整理した。

## Plan: mise tasks サンプル作成

- [x] `sites/mise.yml` を作成し、対象URLを定義する
- [x] `https://mise.jdx.dev/tasks/` を raw として保存する
- [x] raw を元に `ja` 側の翻訳Markdownを作成する
- [x] `state` を作成し、確認結果を記録する

## Review: mise tasks サンプル作成

- `sites/mise.yml` を追加し、`https://mise.jdx.dev/tasks/` を最初の対象URLとして定義した。
- `data/raw/mise/tasks/index.html` に raw HTML を保存した。
- `data/ja/mise/tasks/index.md` に主要本文を日本語 Markdown として保存した。
- `data/state/mise.json` に raw / ja / 取得時刻 / source hash / 状態を記録した。

## Plan: OpenSpec 再定義

- [x] 設定ファイル駆動の翻訳管理ワークフロー向けの change を作成する
- [x] proposal / design / specs / tasks を新方針で定義する
- [x] 状態を確認し、次の実装単位を明確にする

## Review: OpenSpec 再定義

- `add-config-driven-translation-workflow` change を作成した。
- proposal / design / specs / tasks を、設定ファイル・raw・ja・state を軸に定義した。
- `pnpm exec openspec status --change add-config-driven-translation-workflow --json` で artifact 完了を確認した。
- `pnpm exec openspec instructions apply --change add-config-driven-translation-workflow --json` で、次の実装タスクが 8 件あることを確認した。

## Plan: add-config-driven-translation-workflow 実装

- [x] `sites/` の設定ファイル形式と最小必須項目を文書化する
- [x] `data/raw`, `data/ja`, `data/state` の保存ルールを文書化する
- [x] sample データと state を OpenSpec tasks に沿って正式化する
- [x] tasks を完了状態へ更新し、確認結果を記録する

## Review: add-config-driven-translation-workflow 実装

- `sites/README.md` と `sites/_template.yml` を追加し、設定ファイル形式と最小必須項目を固定した。
- `data/README.md` を追加し、raw / ja / state の保存ルールと metadata 項目を定義した。
- `sites/mise.yml`、`data/raw/mise/tasks/index.html`、`data/ja/mise/tasks/index.md`、`data/state/mise.json` を sample として正式化した。
- `openspec/changes/add-config-driven-translation-workflow/tasks.md` の 8 task を完了済みに更新し、`pnpm exec openspec instructions apply --change add-config-driven-translation-workflow --json` で `8/8 complete` を確認した。

## Plan: 実装用 change 作成

- [x] `implement-site-config-and-storage-bootstrap` change を作成する
- [x] 実装スコープに合わせて proposal / design / specs / tasks を定義する
- [x] 次の apply フェーズに進める状態を確認する

## Review: 実装用 change 作成

- `implement-site-config-and-storage-bootstrap` change を作成した。
- 正式 spec を前提に、bootstrap 実装向けの proposal / design / delta specs / tasks を追加した。
- `pnpm exec openspec status --change implement-site-config-and-storage-bootstrap --json` で artifact 完了を確認した。
- `pnpm exec openspec instructions apply --change implement-site-config-and-storage-bootstrap --json` で、次の実装タスクが 8 件あることを確認した。

## Plan: bootstrap 実装

- [x] `sites/*.yml` の最小必須項目を読み取り・検証する実装を追加する
- [x] source URL から raw / ja path を決定する共通処理を追加する
- [x] 翻訳済み metadata と state 更新の共通処理を追加する
- [x] sample データを使ったテストと検証を追加する

## Review: bootstrap 実装

- `src/bootstrap/` に site config 読み込み、path 生成、translated metadata、state 更新の共通処理を追加した。
- `scripts/verify-bootstrap.js` を追加し、`sites/mise.yml`、`data/ja/mise/tasks/index.md`、`data/state/mise.json` が共通処理で再現できることを確認した。
- `test/bootstrap.test.js` を追加し、`pnpm test` で 6 件すべて成功した。
- `pnpm exec openspec instructions apply --change implement-site-config-and-storage-bootstrap --json` で `8/8 complete` を確認した。

## Plan: mise environments サンプル追加

- [x] `https://mise.jdx.dev/environments/` の raw を取得する
- [x] `data/ja/mise/environments/index.md` を追加する
- [x] `data/state/mise.json` に environments ページを追記する
- [x] 結果を確認して記録する

## Review: mise environments サンプル追加

- `data/raw/mise/environments/index.html` に raw HTML を保存した。
- `data/ja/mise/environments/index.md` に主要本文を日本語 Markdown として追加した。
- `data/state/mise.json` に `environments` ページの取得時刻、翻訳時刻、source hash を記録した。
- `sites/mise.yml` の `entry_urls` に `https://mise.jdx.dev/environments/` を追加し、対象URL一覧へ反映した。

## Plan: mise environments 全文準拠化

- [x] 原作準拠を翻訳ルールとして `tasks/lessons.md` に記録する
- [x] `environments` 原文の全見出しと欠落節を洗い出す
- [x] `data/ja/mise/environments/index.md` を全文・原文準拠に修正する
- [x] `data/state/mise.json` と作業記録を更新し、結果を確認する

## Review: mise environments 全文準拠化

- `tasks/lessons.md` に「翻訳成果物は原作準拠で、省略や例の差し替えをしない」ルールを追加した。
- `data/raw/mise/environments/index.html` を基準に、`data/ja/mise/environments/index.md` を抜粋から全文ベースへ差し替えた。
- 欠けていた `Using environment variables`、`Required Variables`、`config_root`、`env._.path`、`Plugin-provided env._ Directives` などの節を追加した。
- `Templates` と `Using env vars in other env vars` の例文を原文準拠の内容へ修正し、`data/state/mise.json` の翻訳時刻も更新した。
