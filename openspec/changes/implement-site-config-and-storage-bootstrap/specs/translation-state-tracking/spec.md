## ADDED Requirements

### Requirement: State records SHALL enforce required page fields
システムは、site state の page record に最小必須項目が揃っていることを保証しなければならない。

#### Scenario: page record を作成または更新する
- **WHEN** state にページを記録するとき
- **THEN** システムは `url`、`slug`、`status`、`raw_path`、`ja_path`、`fetched_at`、`translated_at`、`raw_sha256` を保持しなければならない

### Requirement: State updates SHALL preserve unrelated page records
システムは、あるページの state 更新を行うとき、他ページの記録を壊してはならない。

#### Scenario: 既存 state に新しいページを追加する
- **WHEN** site state に新規 page record を追加または更新するとき
- **THEN** システムは対象ページ以外の既存 record を保持したまま state を更新しなければならない
