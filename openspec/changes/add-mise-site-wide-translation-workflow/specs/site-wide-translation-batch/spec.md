## ADDED Requirements

### Requirement: Site-wide translation batch SHALL materialize discovered pages into raw and translated storage
システムは、列挙済みページ群を raw / translated の保存規約に従って成果物へ反映できなければならない。

#### Scenario: 列挙済みの `mise` ページ群を処理する
- **WHEN** ユーザーが `mise` の発見済みページ一覧を raw / translated へ反映するとき
- **THEN** システムは各ページを `data/raw/mise/` と `data/ja/mise/` の対応 path へ保存できなければならない

### Requirement: Site-wide translation batch SHALL preserve page-level traceability
システムは、サイト全体を扱う場合でも、各翻訳済みページがどの raw ページに対応するかを追跡できなければならない。

#### Scenario: 複数ページをまとめて翻訳した結果をレビューする
- **WHEN** ユーザーが `data/ja/mise/` 配下の翻訳済みファイルを確認するとき
- **THEN** 各ファイルには source URL、raw path、timestamp、hash を含む metadata が保持されていなければならない
