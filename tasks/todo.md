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
