# Site Config

`sites/` 配下には、翻訳対象サイトごとの設定ファイルを置きます。

## 必須項目

- `name`: サイト識別子。`data/raw/<name>/`, `data/ja/<name>/`, `data/state/<name>.json` の基準になる
- `display_name`: 人が読むためのサイト名
- `entry_urls`: 翻訳管理を開始するURL一覧
- `allowed_domains`: 取得対象として許可するドメイン一覧
- `raw_dir`: raw 保存先ディレクトリ
- `ja_dir`: 翻訳済み保存先ディレクトリ
- `state_file`: site 単位の状態管理ファイル

## ルール

- 1ファイルにつき1サイトを定義する
- `name` はディレクトリ名や state ファイル名にそのまま使える文字列にする
- `raw_dir`, `ja_dir`, `state_file` はリポジトリルートからの相対パスで記述する
- `entry_urls` は後続の取得や追加ページ管理の起点として扱う
- `allowed_domains` に含まれないURLは、そのサイト設定では扱わない

## 例

`mise` の例は [`sites/mise.yml`](mise.yml) を参照。
