## MODIFIED Requirements

### Requirement: Site settings SHALL define the translation target
システムは、各翻訳対象サイトを専用の設定ファイルで管理し、サイト名、対象URL、許可ドメイン、保存先に加えて、サイト全体の収集スコープと除外ルールを定義できなければならない。

#### Scenario: 翻訳管理対象のサイトを登録する
- **WHEN** ユーザーが対象サイトの設定ファイルを追加するとき
- **THEN** 設定ファイルにはサイト識別子、少なくとも1件の entry URL、許可ドメイン一覧、raw / translated / state の保存先参照が含まれていなければならない
- **AND** サイト全体を扱う場合は、対象 path 範囲または除外ルールを設定できなければならない

### Requirement: Site settings SHALL be reusable across repeated runs
システムは、同じサイト設定ファイルを初回取得、後続の翻訳、将来の更新時にも再利用できなければならない。

#### Scenario: 同じサイトを複数回処理する
- **WHEN** ユーザーがすでに登録済みのサイトを再度扱うとき
- **THEN** システムは既存のサイト設定ファイルを、対象URL、収集スコープ、保存先の正本として利用しなければならない
