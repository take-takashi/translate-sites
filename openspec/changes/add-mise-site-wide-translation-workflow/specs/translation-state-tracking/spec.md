## MODIFIED Requirements

### Requirement: Translation state SHALL be tracked per site
システムは、どのページを取得済みか、どのページを翻訳済みか、どのページをスキップしたかを追跡する site 単位の state 記録を保持しなければならない。

#### Scenario: 管理対象サイトにページが追加される
- **WHEN** あるページがサイトの翻訳ワークフローへ追加されたとき
- **THEN** システムはそのページを site の state ファイルへ処理状態付きで記録しなければならない
- **AND** スキップしたページについては理由を記録できなければならない

### Requirement: Translation state SHALL link raw and translated artifacts
システムは、各ページURLと、それに対応する raw artifact および translated artifact の関係を追跡しなければならない。

#### Scenario: raw と translated の両方が存在する
- **WHEN** 同じページに対応する raw と translated の成果物が存在するとき
- **THEN** site の state ファイルにはページURL、raw path、translated path、および関連する timestamp や hash が記録されていなければならない

#### Scenario: 発見済みだが未翻訳のページが存在する
- **WHEN** サイト全体のページ一覧には含まれるが、まだ raw または translated が未作成のページがあるとき
- **THEN** site の state ファイルには、そのページの現在状態が判別できる値が記録されていなければならない
