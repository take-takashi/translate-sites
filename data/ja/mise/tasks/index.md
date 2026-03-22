---
title: "Tasks"
source_url: "https://mise.jdx.dev/tasks/"
raw_path: "data/raw/mise/tasks/index.html"
fetched_at: "2026-03-21T23:49:32Z"
source_last_modified: "Sat, 21 Mar 2026 22:23:50 GMT"
translated_at: "2026-03-22T08:49:32+0900"
translator: "OpenAI Codex"
raw_sha256: "04e4d8907679eb60efd1e5467ba35262f663b29a72600b346549ca3b679e2f5a"
---

# Tasks

> [`make`](https://www.gnu.org/) のように、プロジェクトのビルドやテストで使うタスクを管理します。

`mise.toml` ファイルの中、または独立したシェルスクリプトとしてタスクを定義できます。これらは lint、test、build、server 起動など、プロジェクト固有の処理をまとめるのに便利です。もちろん、mise から起動したタスクには mise の環境が含まれるため、`mise.toml` で定義したツールや環境変数も利用できます。

mise のタスクランナーで特に便利なのは次の点です。

- 依存関係のビルドを並列で実行できること。しかもデフォルトで、特別な設定をほとんど必要としません。
- 最終更新時刻を見て、変更がないときは再ビルドを避けられること。必要な設定も最小限です。
- [`mise watch`](https://mise.jdx.dev/cli/watch.html) により、変更時の自動再ビルドを設定なしに近い形で使えること。
- YAML や JSON、TOML の文字列の中ではなく、実際の bash スクリプトファイルとしてタスクを書けること。構文ハイライトや lint / check の支援を受けやすくなります。

タスクの定義方法は 2 つあります。[`mise.toml` の中で定義する方法](https://mise.jdx.dev/tasks/toml-tasks.html) と、[独立したシェルスクリプトとして定義する方法](https://mise.jdx.dev/tasks/file-tasks.html) です。加えて、[task templates](https://mise.jdx.dev/tasks/task-templates.html) を使えば、再利用可能なタスク定義も作れます。

## `mise.toml` ファイル内の Tasks

タスクは `mise.toml` の `[tasks]` セクションで定義します。

```toml
[tasks.build]
description = "Build the CLI"
run = "cargo build"
```

定義したタスクは `mise run build` で実行できます。既存コマンドと衝突しない場合は `mise build` でも実行できます。

- 詳細は [TOML tasks](https://mise.jdx.dev/tasks/toml-tasks.html) を参照してください。
- 実行方法は [Running Tasks](https://mise.jdx.dev/tasks/running-tasks.html) を参照してください。

## File Tasks

タスクは独立したシェルスクリプトとして定義することもできます。`mise-tasks` のような特定ディレクトリに、実行可能属性を持つファイルを置くだけです。

`mise-tasks/build`

```sh
#!/usr/bin/env bash
#MISE description="Build the CLI"
cargo build
```

こちらも TOML タスクと同様に `mise run build` で実行できます。詳細は [file tasks reference](https://mise.jdx.dev/tasks/file-tasks.html) を参照してください。

## Tasks に渡される環境変数

タスクには次の環境変数が渡されます。

- `MISE_ORIGINAL_CWD`: タスクを実行した元のカレントディレクトリ
- `MISE_CONFIG_ROOT`: タスクが定義された `mise.toml` を含むディレクトリ。設定ファイルのパスが `~/src/myproj/.config/mise.toml` のような場合は `~/src/myproj` になります
- `MISE_PROJECT_ROOT`: プロジェクトのルートディレクトリ
- `MISE_TASK_NAME`: 実行中のタスク名
- `MISE_TASK_DIR`: タスクスクリプトを含むディレクトリ
- `MISE_TASK_FILE`: タスクスクリプトのフルパス
