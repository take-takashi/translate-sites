## 1. Site Config Bootstrap

- [x] 1.1 `sites/*.yml` の最小必須項目を読み取り・検証する実装を追加する
- [x] 1.2 `sites/mise.yml` をその実装で検証し、sample config が通ることを確認する

## 2. Storage Path Rules

- [x] 2.1 source URL から raw / ja の保存 path を決定する共通処理を追加する
- [x] 2.2 `mise/tasks` sample の path が既存構成と一致することを確認する

## 3. Translation Metadata

- [x] 3.1 翻訳済み Markdown の必須 metadata を組み立てる共通処理を追加する
- [x] 3.2 `data/ja/mise/tasks/index.md` がその形式に沿うことを確認する

## 4. State Bootstrap

- [x] 4.1 `data/state/<site>.json` の page record を追加・更新する共通処理を追加する
- [x] 4.2 `data/state/mise.json` をその処理で再現できることを確認する
