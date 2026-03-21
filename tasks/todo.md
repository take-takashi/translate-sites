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
