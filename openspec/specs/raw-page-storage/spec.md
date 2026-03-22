## ADDED Requirements

### Requirement: Raw pages SHALL be stored under a site-specific raw directory
システムは、ダウンロードした原文ページをサイトごとの raw ディレクトリ配下へ保存し、翻訳後も元の内容を参照できるようにしなければならない。

#### Scenario: 設定済みページをダウンロードする
- **WHEN** サイト設定に含まれる対象URLの取得に成功したとき
- **THEN** システムはそのサイト用に設定された raw ディレクトリ配下へ原文ページを保存しなければならない

### Requirement: Raw storage SHALL preserve traceability to the source URL
システムは、raw ファイルから元の source URL を特定できるだけの追跡情報を保持しなければならない。

#### Scenario: 保存済み raw ページを後から見直す
- **WHEN** ユーザーが過去にダウンロードした raw ファイルを確認するとき
- **THEN** システムは保存済みメタデータまたは state 記録から元の source URL を特定できるようにしなければならない
