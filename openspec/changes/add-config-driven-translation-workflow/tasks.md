## 1. Site Configuration

- [x] 1.1 `sites/` 配下の設定ファイル形式を決め、最小必須項目を定義する
- [x] 1.2 サンプルサイト設定を追加し、対象URLと保存先の対応を確認する

## 2. Raw Storage

- [x] 2.1 設定ファイルを元に raw ディレクトリへ保存するワークフローを整える
- [x] 2.2 raw ファイルと元URLの対応を追跡できるようにする

## 3. Translated Storage

- [x] 3.1 raw を元に ja ディレクトリへ翻訳済みファイルを保存するワークフローを整える
- [x] 3.2 翻訳済みファイルに source metadata を残す形式を決める

## 4. State Tracking

- [x] 4.1 `data/state/<site>.json` の項目を定義し、raw / ja / status を追跡できるようにする
- [x] 4.2 サンプルページで state 更新の流れを確認する
