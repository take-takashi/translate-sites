## ADDED Requirements

### Requirement: Site settings SHALL reject missing required fields
システムは、`sites/*.yml` を扱う際に、最小必須項目が欠けている設定ファイルを検出できなければならない。

#### Scenario: 必須項目が不足している設定ファイルを読む
- **WHEN** `name`、`entry_urls`、`allowed_domains`、`raw_dir`、`ja_dir`、`state_file` のいずれかが欠けた設定ファイルを読み込むとき
- **THEN** システムは不足項目を明示して、その設定を有効な site config として扱ってはならない

### Requirement: Site settings SHALL expose normalized storage references
システムは、妥当な設定ファイルを読み込んだとき、raw / ja / state の保存先参照を後続処理で再利用できる形に正規化しなければならない。

#### Scenario: 妥当な設定ファイルを読む
- **WHEN** 最小必須項目を満たす設定ファイルを読み込むとき
- **THEN** システムは site identifier、entry URLs、allowed domains、storage references を後続処理が利用できる形で取り出せなければならない
