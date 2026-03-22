## ADDED Requirements

### Requirement: Translation state SHALL be tracked per site
システムは、どのページを取得済みか、どのページを翻訳済みかを追跡する site 単位の state 記録を保持しなければならない。

#### Scenario: 管理対象サイトにページが追加される
- **WHEN** あるページがサイトの翻訳ワークフローへ追加されたとき
- **THEN** システムはそのページを site の state ファイルへ処理状態付きで記録しなければならない

### Requirement: Translation state SHALL link raw and translated artifacts
システムは、各ページURLと、それに対応する raw artifact および translated artifact の関係を追跡しなければならない。

#### Scenario: raw と translated の両方が存在する
- **WHEN** 同じページに対応する raw と translated の成果物が存在するとき
- **THEN** site の state ファイルにはページURL、raw path、translated path、および関連する timestamp や hash が記録されていなければならない
