## ADDED Requirements

### Requirement: Translated page path SHALL mirror raw page structure
システムは、翻訳済みページの保存 path を raw 側のページ構造と対応する形で決定できなければならない。

#### Scenario: raw と対応する ja path を決める
- **WHEN** site config と対象ページURLが与えられるとき
- **THEN** システムは raw 側と対応関係が追える translated path を導出しなければならない

### Requirement: Translated markdown SHALL include required bootstrap metadata
システムは、翻訳済み Markdown を保存する際に、bootstrap で必須と定義した metadata を含めなければならない。

#### Scenario: 翻訳済み Markdown を保存する
- **WHEN** translated page を出力するとき
- **THEN** システムは `title`、`source_url`、`raw_path`、`fetched_at`、`translated_at`、`translator`、`raw_sha256` を含めなければならない
