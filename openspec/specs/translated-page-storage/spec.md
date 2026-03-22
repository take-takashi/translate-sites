## ADDED Requirements

### Requirement: Translated pages SHALL be stored separately from raw pages
システムは、翻訳済み成果物を raw 原文とは別の専用 translated ディレクトリへ保存しなければならない。

#### Scenario: raw ページを日本語へ翻訳する
- **WHEN** ダウンロード済みの raw ページを日本語へ翻訳したとき
- **THEN** 翻訳結果は raw ファイルを上書きせず、同じサイトに対応する translated ディレクトリ配下へ保存されなければならない

### Requirement: Translated output SHALL retain source metadata
システムは、各翻訳済みページに source metadata を含め、人間が翻訳元を追跡できるようにしなければならない。

#### Scenario: 翻訳済みページをレビューする
- **WHEN** ユーザーが翻訳済みページファイルを開くとき
- **THEN** そのファイルには元の source URL と、どの raw ソースから生成されたかを特定できるだけのメタデータが含まれていなければならない
