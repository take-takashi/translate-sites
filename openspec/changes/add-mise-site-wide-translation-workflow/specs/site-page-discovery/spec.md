## ADDED Requirements

### Requirement: Site page discovery SHALL enumerate official documentation pages
システムは、サイト設定に基づいて、翻訳対象となる公式ドキュメント本文ページの URL 一覧を列挙しなければならない。

#### Scenario: `mise` 公式ドキュメントを列挙する
- **WHEN** ユーザーが `sites/mise.yml` を使って `mise.jdx.dev` のページ一覧を収集するとき
- **THEN** システムは許可ドメインと対象 path 範囲に含まれる公式ドキュメントページだけを列挙しなければならない

### Requirement: Site page discovery SHALL exclude non-documentation pages
システムは、公式ドキュメント本文に含めない URL を除外できなければならない。

#### Scenario: 対象外 URL が内部リンクとして見つかる
- **WHEN** ページ一覧収集中に検索 UI、編集リンク、外部サイト、ブログなどの対象外 URL が見つかったとき
- **THEN** システムはそれらを翻訳対象一覧へ追加してはならない

### Requirement: Site page discovery SHALL normalize discovered URLs
システムは、発見したページ URL を重複なく扱えるように正規化しなければならない。

#### Scenario: 同じページが複数のリンク形式で現れる
- **WHEN** 末尾スラッシュの有無や相対リンク差異により同じページが複数回見つかったとき
- **THEN** システムはそれらを同一ページとして正規化し、1 件だけ保持しなければならない
