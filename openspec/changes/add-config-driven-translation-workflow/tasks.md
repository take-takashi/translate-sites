## 1. Site Configuration

- [ ] 1.1 `sites/` 配下の設定ファイル形式を決め、最小必須項目を定義する
- [ ] 1.2 サンプルサイト設定を追加し、対象URLと保存先の対応を確認する

## 2. Raw Storage

- [ ] 2.1 設定ファイルを元に raw ディレクトリへ保存するワークフローを整える
- [ ] 2.2 raw ファイルと元URLの対応を追跡できるようにする

## 3. Translated Storage

- [ ] 3.1 raw を元に ja ディレクトリへ翻訳済みファイルを保存するワークフローを整える
- [ ] 3.2 翻訳済みファイルに source metadata を残す形式を決める

## 4. State Tracking

- [ ] 4.1 `data/state/<site>.json` の項目を定義し、raw / ja / status を追跡できるようにする
- [ ] 4.2 サンプルページで state 更新の流れを確認する
