## ADDED Requirements

### Requirement: Raw page path SHALL be derived deterministically from URL
システムは、対象ページの raw 保存 path を site 設定と source URL から一意に決定できなければならない。

#### Scenario: URL から raw 保存 path を決める
- **WHEN** site config と対象URLが与えられるとき
- **THEN** システムは同じ入力に対して常に同じ raw 保存 path を導出しなければならない

### Requirement: Raw storage SHALL preserve existing sample layout
システムは、既存 sample で採用している raw 配置を壊さずに扱えなければならない。

#### Scenario: `mise/tasks` sample を扱う
- **WHEN** `https://mise.jdx.dev/tasks/` を raw として扱うとき
- **THEN** システムは `data/raw/mise/tasks/index.html` を妥当な保存先として扱えなければならない
