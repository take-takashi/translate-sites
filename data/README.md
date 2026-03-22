# Data Layout

`data/` 配下は `raw`, `ja`, `state` の3種類に分けて管理します。

## raw

- 保存先: `data/raw/<site>/...`
- 役割: ダウンロードした原文をそのまま保持する
- 推奨形式: まずは HTML を保存する

## ja

- 保存先: `data/ja/<site>/...`
- 役割: raw を元に作成した日本語訳を保持する
- 推奨形式: Markdown

翻訳済み Markdown には少なくとも次の metadata を含める。

- `title`
- `source_url`
- `raw_path`
- `fetched_at`
- `translated_at`
- `translator`
- `raw_sha256`

必要に応じて `source_last_modified` のような source 側 metadata を追加してよい。

## state

- 保存先: `data/state/<site>.json`
- 役割: site 単位の進捗と raw / ja の対応関係を追跡する

各 page record には少なくとも次を含める。

- `url`
- `slug`
- `status`
- `raw_path`
- `ja_path`
- `fetched_at`
- `translated_at`
- `raw_sha256`

必要に応じて `source_last_modified` や `notes` を追加してよい。

## パス対応の考え方

- `sites/<site>.yml` が管理対象サイトの正本
- `data/raw/<site>/...` が原文
- `data/ja/<site>/...` が翻訳済み成果物
- `data/state/<site>.json` が raw / ja / status の対応表
