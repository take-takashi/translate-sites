# OpenSpec Working Rules

## Source Of Truth

- プロジェクトの目的、MVP、非目標の正本は [README.md](../README.md) とする
- OpenSpec の共通前提は [project.md](./project.md) を参照する
- 概要を更新する場合は、まず `README.md` を更新し、その後に必要なら `project.md` を同期する

## Proposal

- まずMVPに必要な最小スコープで提案すること
- 1つの変更に複数の大きな目的を混ぜないこと
- 実装詳細より先に、ユーザー価値と要求される振る舞いを固めること

## Design

- 新しい外部依存を追加する場合は `design.md` を作ること
- `fetch / extract / convert / translate / save` の責務境界を明示すること
- 将来差し替え可能な構成を優先し、MVP段階で不要な抽象化は増やしすぎないこと

## Specs

- capability はユーザーから見た振る舞い単位で分けること
- 実装手段ではなく、何を満たす必要があるかを書くこと
- 各 Requirement には、テスト可能な `#### Scenario:` を少なくとも1つ含めること
- 初期段階では単一URLのCLIに直接必要な要求だけを定義すること

## Tasks

- タスクは1セッションで進められる粒度に分割すること
- 依存順に並べること
- 検証手順またはテストを必ず含めること

## Project-Specific Constraints

- 明示的に求められるまで、クロール、キャッシュ、用語集管理は追加しない
- 翻訳品質の改善より先に、本文抽出とMarkdown構造維持を優先する
- ノイズの多い全ページ翻訳ではなく、本文中心の出力を優先する
