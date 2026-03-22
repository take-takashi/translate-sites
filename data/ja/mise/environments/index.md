---
title: "Environments"
source_url: "https://mise.jdx.dev/environments/"
raw_path: "data/raw/mise/environments/index.html"
fetched_at: "2026-03-22T06:20:27Z"
source_last_modified: "Sun, 22 Mar 2026 05:55:58 GMT"
translated_at: "2026-03-22T16:08:49+0900"
translator: "OpenAI Codex"
raw_sha256: "7b012eea7d0ffc0feefe5da026991b0a39a6d9b09be8f66d5aac3ada368b7f7b"
---

# Environments

> [`direnv`](https://github.com/direnv/direnv) のように、プロジェクトディレクトリごとに環境変数を管理します。

mise を使うと、プロジェクトごとに使う環境変数を定義できます。

まずは、プロジェクトのルートディレクトリに `mise.toml` を作成します。

```toml
[env]
NODE_ENV = "production"
```

環境変数を解除したい場合は、値に `false` を設定します。

```toml
[env]
NODE_ENV = false # 以前に設定された NODE_ENV を解除する
```

CLI を使って環境変数を取得・設定することもできます。

```sh
mise set NODE_ENV=development
# mise set NODE_ENV
# development

mise set
# key       value        source
# NODE_ENV  development  mise.toml

cat mise.toml
# [env]
# NODE_ENV = "development"

mise unset NODE_ENV
```

さらに、[`mise env --json --dotenv`](https://mise.jdx.dev/cli/env.html) を使うと、`PATH` やツール／プラグイン由来の環境変数も含めて、さまざまな形式で書き出せます。

## Using environment variables

環境変数は [`mise exec`](https://mise.jdx.dev/cli/exec.html) や [`mise run`](https://mise.jdx.dev/cli/run.html) から利用できます。

```sh
mise set MY_VAR=123
mise exec -- echo $MY_VAR
# 123
```

もちろん、[tools](https://mise.jdx.dev/dev-tools/) と組み合わせることもできます。

```sh
mise use node@24
mise set MY_VAR=123
cat mise.toml
# [tools]
# node = "24"
# [env]
# MY_VAR = "123"
mise exec -- node --eval 'console.log(process.env.MY_VAR)'
# 123
```

[mise を activate](https://mise.jdx.dev/cli/activate.html) している場合は、対象ディレクトリへ `cd` した時点で、そのシェルに環境変数が自動で反映されます。

```sh
cd /path/to/project
mise set NODE_ENV=production
cat mise.toml
# [env]
# NODE_ENV = "production"

echo $NODE_ENV
# production
```

[shims](https://mise.jdx.dev/dev-tools/shims.html) を使っている場合は、shim 経由で起動したコマンドからも環境変数を参照できます。

```sh
mise set NODE_ENV=production
mise use node@24
# 例なので絶対パスを使っている
~/.local/share/mise/shims/node --eval 'console.log(process.env.NODE_ENV)'
```

最後に、[`mise en`](https://mise.jdx.dev/cli/en.html) を使うと、環境変数が設定された新しいシェルセッションを起動できます。

```sh
mise set FOO=bar
mise en
echo $FOO
# bar
```

## Environment in tasks

タスクの中で環境変数を定義することもできます。

```toml
[tasks.print]
run = "echo $MY_VAR"
env = { _.file = "/path/to/file.env", "MY_VAR" = "my variable" }
```

## Lazy eval

通常、環境変数はツールより先に解決されます。これは、環境変数を使ってツールのインストール設定を行えるようにするためです。ただし、ツールが生成した環境変数を後から参照したいこともあります。その場合は、値をマップにして `tools = true` を指定します。

```toml
[env]
MY_VAR = { value = "tools path: {{env.PATH}}", tools = true }
_.path = { path = ["{{env.GEM_HOME}}/bin"], tools = true } # directive でも tools = true を指定できる
NODE_VERSION = { value = "{{ tools.node.version }}", tools = true }
```

## Redactions

秘密情報を含む環境変数は、ログや表示結果で自動的にマスクできます。値を伏せたい変数を扱う場合に使います。

### Viewing Redacted Environment Variables

redact 対象の値は通常出力では伏せられます。必要なら、どの値が隠されているかを前提に運用し、平文の扱いを避けます。

## Required Variables

`required = true` を使うと、その変数が必須であることを宣言できます。

### Required Variable Behavior

変数に `required = true` を付けると、mise はその変数が次のいずれかで定義されているかを検証します。

1. mise 実行前の環境にすでに存在する
2. その宣言より後で処理される設定ファイルに定義されている

```toml
# mise.toml
[env]
DATABASE_URL = { required = true }
```

```toml
# mise.local.toml
[env]
DATABASE_URL = "postgres://prod.example.com/db" # これで要件を満たす
```

### Validation Behavior

- 通常コマンド（たとえば `mise env`）では、必須変数が欠けていると明確なエラーで失敗します。
- シェル有効化（`hook-env`）では、シェル初期化を壊さないよう警告を出しつつ続行します。

```sh
# DATABASE_URL が事前定義されていないか、後続設定にもない場合は失敗する
mise env
Error: Required environment variable 'DATABASE_URL' is not defined...

# こちらは警告だけ出して継続する
mise hook-env --shell bash
mise WARN Required environment variable 'DATABASE_URL' is not defined...
```

### Use Cases

必須変数は次のような用途で有効です。

- データベース接続: 重要な接続文字列が明示的に設定されていることを保証する
- API キー: 機密性の高い認証情報を必ず設定させる
- 環境別設定: 環境ごとの明示的な設定を強制する
- チーム開発: メンバーが何を設定すべきかを文書化する

```toml
[env]
# API keys（環境変数または mise.local.toml で設定が必要）
STRIPE_API_KEY = { required = true }
SENTRY_DSN = { required = true }

# Database connection（環境変数または mise.local.toml で設定が必要）
DATABASE_URL = { required = true }

# Feature flags（明示的な設定が必要）
ENABLE_BETA_FEATURES = { required = true }
```

## `config_root`

`config_root` は、設定ファイル内の相対パスを解決するときに mise が使う正規のプロジェクトルートです。通常、mise で相対パスを書くときはこのディレクトリを基準にしています。

- 設定ファイルが `.config/mise/config.toml` や `.mise/config.toml` のようなネストした場所にある場合、`config_root` はそれらを含むプロジェクトディレクトリを指します。たとえば `/path/to/project` です。
- 設定ファイルがプロジェクトルート直下の `mise.toml` にある場合、`config_root` はそのまま現在のディレクトリです。
- 環境 directive 内の相対パスは `config_root` を基準に解決されるため、設定ファイル自体の置き場所に依らず一貫した挙動になります。

たとえば次は同じ意味になります。

```toml
[env]
# どちらもプロジェクトルート基準で解決される
_.path = ["tools/bin", "{{config_root}}/tools/bin"]

# こちらも同様
_.source = "scripts/env.sh" # == "{{config_root}}/scripts/env.sh"
```

## `env._` directives

`env._.*` は、環境変数設定に特別な振る舞いを与える directive です。たとえばファイルから環境変数を読み込む、といった用途に使います。ネストした通常の環境変数という概念は意味を持たないため、`_` というキーを TOML テーブルとして再利用しています。

### `env._.file`

`mise.toml` では、`env._.file` を使って [dotenv](https://dotenv.org) ファイルを読み込めます。

```toml
[env]
_.file = ".env"
```

この機能の内部では `dotenvy` が使われます。`env._.file` の挙動に問題がある場合、原因は mise 本体ではなくそのクレート側にある可能性があります。

`env._.file` は次をサポートします。

- 単一ファイルを文字列またはオブジェクトで指定
- 複数ファイルを文字列／オブジェクトの配列で指定
- 相対パス・絶対パスの両方
- `dotenv`、`json`、`yaml` 形式
- `redact` と `tools` オプション

```toml
[env]
_.file = ".env"
_.file = ["./.env", "./.env.local"]
```

任意のディレクトリで dotenv を自動読み込みしたい場合は、`MISE_ENV_FILE=.env` を設定できます。暗号化ファイルを `env._.file` で扱う方法は `secrets` のドキュメントを参照してください。

### `env._.path`

`PATH` は特別扱いされます。`env._.path` を使うと、追加ディレクトリを `PATH` に加えられます。

```toml
[env]
_.path = "./bin"
```

`env._.path` は次をサポートします。

- 単一パスを文字列またはオブジェクトで指定
- 複数パスを文字列／オブジェクトの配列で指定
- 相対パス・絶対パスの両方
- `tools` オプション

```toml
[env]
_.path = "scripts"
```

```toml
[env]
# tools が環境変数を定義した後でこの PATH を追加する
_.path = { path = ["{{env.GEM_HOME}}/bin"], tools = true }
```

```toml
[env]
_.path = [
  "~/.local/share/bin",
  "{{config_root}}/node_modules/.bin",
  "tools/bin"
]
```

`tools/bin` や `./tools/bin` のような相対パスは `{{config_root}}` を基準に解決されます。

### `env._.source`

外部の bash スクリプトを source し、その中で export された環境変数を取り込みたい場合は `env._.source` を使います。

```toml
[env]
_.source = "./script.sh"
```

これは実質的に `source ./script.sh` のように bash で実行されることが前提です。shebang は無視されます。

`env._.source` は次をサポートします。

- 単一 source を文字列またはオブジェクトで指定
- 複数 source を文字列／オブジェクトの配列で指定
- 相対パス・絶対パスの両方
- `redact` と `tools` オプション

```toml
[env]
_.source = "source.sh"
```

```toml
[env]
_.source = [
  "./scripts/base.sh",
  "/User/bob/env.sh"
]
```

## Plugin-provided `env._` Directives

プラグインは独自の `env._` directive を提供して、環境変数の動的設定や `PATH` の変更を行えます。これは次のようなケースで有効です。

- 外部のシークレット管理システムとの連携
- 動的条件に応じた環境変数の設定
- 複雑な `PATH` 構成の管理
- チーム全体での環境標準化

### Basic Usage

単純なプラグイン有効化:

```toml
[env]
_.my-plugin = {}
```

設定オプション付き:

```toml
[env]
_.my-plugin = { option1 = "value1", option2 = "value2" }
```

### How It Works

`env._.<plugin-name>` を使うと、mise は次の順で処理します。

1. インストール済みプラグインを読み込む
2. プラグインの `MiseEnv` フックを呼び、環境変数を取得する
3. 必要ならプラグインの `MisePath` フックを呼び、`PATH` エントリを取得する
4. `mise env` 実行時やシェル統合時に、その結果を環境へ反映する

`=` の右側に書いた TOML テーブルは `ctx.options` 経由でフックへ渡されるため、プロジェクト単位・環境単位でプラグイン設定を変えられます。

### Example: Secret Management Plugin

```toml
[env]
# vault から secret を取得する
_.vault-secrets = {
  vault_url = "https://vault.example.com",
  secrets_path = "secret/myapp"
}
```

この場合、プラグインは HashiCorp Vault から secret を取得し、それを環境変数として公開できます。

### Example: Dynamic Environment Plugin

```toml
[env]
# git branch に応じて環境を切り替える
_.git-env = { production_branch = "main" }
```

この例では、現在の git branch を見て、`main` なら `ENVIRONMENT=production`、それ以外なら `ENVIRONMENT=development` を設定できます。

### Creating Environment Plugins

独自の環境プラグインを作る方法は、Plugins ドキュメントの Environment Plugins を参照してください。動作する実例として `mise-env-plugin-template` リポジトリも紹介されています。

## Multiple `env._` Directives

複数の `env._` directive を使いたいことがありますが、通常の TOML では同じキーを 2 回書けないため、次の書き方は失敗します。

```toml
[env]
_.source = "./script_1.sh"
_.source = "./script_2.sh" # invalid
```

このケースでは、`[env]` を配列テーブルにして `[[env]]` を使います。

```toml
[[env]]
_.source = "./script_1.sh"
[[env]]
_.source = "./script_2.sh"
```

挙動は同じですが、複数テーブルを書けるようになります。

## Templates

環境変数の値にはテンプレートを使えます。詳細は Templates ドキュメントを参照してください。

```toml
[env]
LD_LIBRARY_PATH = "/some/path:{{env.LD_LIBRARY_PATH}}"
```

## Using env vars in other env vars

後から定義する環境変数では、前に定義した環境変数の値を参照できます。

```toml
[env]
MY_PROJ_LIB = "{{config_root}}/lib"
LD_LIBRARY_PATH = "/some/path:{{env.MY_PROJ_LIB}}"
```

この場合は、当然ながら定義順が重要です。

## Shell-style variable expansion

環境変数参照に Tera テンプレートを使う代わりに、`env_shell_expand` を有効化してシェル形式の `$VAR` 構文を使うこともできます。

```toml
[settings]
env_shell_expand = true

[env]
MY_PROJ_LIB = "{{config_root}}/lib"
LD_LIBRARY_PATH = "$MY_PROJ_LIB:$LD_LIBRARY_PATH"
```

サポートされる構文は次のとおりです。

| 構文 | 説明 |
| --- | --- |
| `$VAR` | `VAR` の値へ展開する |
| `${VAR}` | 同じ意味。後ろに英数字が続く場合に便利 |
| `${VAR:-default}` | `VAR` が未設定または空なら `default` を使う |
| `${VAR:-}` | `VAR` が未設定なら空文字列に展開し、未定義警告を抑える |

展開は Tera テンプレートの評価後に行われるため、両方を混在させることもできます。デフォルト値なしの未定義変数は展開されず、そのまま残って警告が出ます。

この設定は 3 状態で扱われます。

- `true`: シェル展開を有効にする
- `false`: シェル展開を無効にし、警告も出さない
- 未設定: 既定値。シェル展開は無効だが、`$` を検出すると警告する

将来的には 2026.7.0 リリースでシェル展開がデフォルトになる予定です。先に有効化したいなら `env_shell_expand = true` を、現在の挙動を維持したいなら `env_shell_expand = false` を明示します。
