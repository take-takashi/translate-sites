## 1. Site Scope Config

- [ ] 1.1 `sites/mise.yml` に site-wide 収集用の scope / exclude 設定を追加する
- [ ] 1.2 site config 読み込み処理を拡張し、新しい設定項目を検証できるようにする

## 2. Page Discovery

- [ ] 2.1 `mise.jdx.dev` の内部リンクから翻訳対象ページ一覧を列挙する処理を追加する
- [ ] 2.2 許可ドメイン、path 範囲、除外ルールで docs 本文ページだけへ絞り込む
- [ ] 2.3 URL 正規化と重複排除を実装し、安定したページ一覧を得られることを確認する

## 3. Site-Wide Storage and State

- [ ] 3.1 列挙済みページ群を raw / ja / state へ反映する batch 処理を追加する
- [ ] 3.2 `data/state/mise.json` に discovered / raw-only / translated / skipped を記録できるようにする
- [ ] 3.3 スキップしたページの理由を state に残せることを確認する

## 4. Mise Verification

- [ ] 4.1 `mise` 公式ドキュメント全体を対象に sample の対象ページ一覧を作成する
- [ ] 4.2 representative pages を複数件 raw / ja / state へ反映して原作準拠を確認する
- [ ] 4.3 検証手順と結果を `tasks/todo.md` に記録する
