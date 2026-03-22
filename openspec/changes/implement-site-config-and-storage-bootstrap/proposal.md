## 背景

`openspec/specs/` には設定ファイル、raw 保存、翻訳済み保存、state 追跡の正式仕様が揃いましたが、現状は手作業サンプルがあるだけで、同じ流れを再現可能な実装として扱う仕組みがありません。次の段階として、`sites/*.yml` と `data/` 配下の構成をブートストラップできる最小実装を入れる必要があります。

## 変更内容

- `sites/*.yml` を読み取り、最小必須項目を検証する bootstrap 実装を追加する
- `data/raw`, `data/ja`, `data/state` を更新するための共通処理を追加する
- `mise` サンプルを、正式ルールに沿った再現可能なデータ更新フローとして扱えるようにする
- state 更新と source metadata 付与を、手作業依存ではなく同じ処理経路で揃えられるようにする

## Capability

### 新規 Capability

### 変更対象 Capability
- `site-config-registry`: 設定ファイルの最小必須項目と検証結果の扱いを追加する
- `raw-page-storage`: raw 保存先の決定方法と保存時の path ルールを追加する
- `translated-page-storage`: 翻訳済み Markdown の metadata 形式と保存ルールを追加する
- `translation-state-tracking`: state JSON の最小必須項目と更新ルールを追加する

## 影響範囲

- `sites/` と `data/` を扱う最小実装コードの追加が必要になる
- sample データ更新手順を再利用できる形で揃える必要がある
- 今後の自動取得や更新追従の土台として、path ルールと JSON 形式を固定する必要がある
