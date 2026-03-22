# Specs Index

`openspec/specs/` は、このプロジェクトで現在有効な正式仕様の正本です。

## 読む順番

1. `site-config-registry/spec.md`
2. `raw-page-storage/spec.md`
3. `translated-page-storage/spec.md`
4. `translation-state-tracking/spec.md`

## 仕様一覧

### 1. Site Config Registry

- パス: `openspec/specs/site-config-registry/spec.md`
- 役割: 翻訳対象サイトをどの設定ファイル形式で定義するかを決める
- 主に決めていること:
  - サイト設定ファイルの必須項目
  - 対象URL、許可ドメイン、保存先の持ち方
  - 同じ設定を繰り返し利用する前提

### 2. Raw Page Storage

- パス: `openspec/specs/raw-page-storage/spec.md`
- 役割: 取得した原文ページを raw としてどう保存するかを決める
- 主に決めていること:
  - サイト別 raw ディレクトリへの保存
  - raw ファイルと source URL の追跡性

### 3. Translated Page Storage

- パス: `openspec/specs/translated-page-storage/spec.md`
- 役割: 翻訳済み成果物を ja 側へどう保存するかを決める
- 主に決めていること:
  - raw と翻訳済み成果物の分離
  - 翻訳済みファイルに残す source metadata

### 4. Translation State Tracking

- パス: `openspec/specs/translation-state-tracking/spec.md`
- 役割: raw / ja / status の対応関係をどう追跡するかを決める
- 主に決めていること:
  - site 単位の state 記録
  - ページURL、raw、translated、timestamp、hash の管理

## 補足

- 進行中の変更案は `openspec/changes/` を見る
- 完了済み change の履歴は `openspec/changes/archive/` を見る
- 現在有効な仕様だけ確認したいときは、この `SPECS.md` から読む
