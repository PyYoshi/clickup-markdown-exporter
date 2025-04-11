# ClickUp Markdown Exporter

ClickUpのドキュメントをMarkdownファイルとしてエクスポートするためのCLIツールです。ドキュメントの階層構造を維持しながら、ローカルのディレクトリ構造にエクスポートします。

## 機能

- ClickUp APIを使用してドキュメントを取得
- ドキュメントの階層構造を維持したディレクトリ構造での出力
- 各ドキュメントのメタデータをJSONファイルとして保存
- コマンドラインオプションによる柔軟な設定

## 必要条件

- Node.js 12.0以上
- ClickUp APIキー

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/PyYoshi/clickup-markdown-exporter
cd clickup-markdown-exporter

# 依存パッケージをインストール
npm ci
```

## 使用方法

```bash
node clickup-markdown-exporter.js -w <workspaceId> -d <docId> [-k <apiKey>] [-o <outputDir>]
```

### オプション

| オプション | 省略形 | 説明 | デフォルト値 |
|------------|--------|------|-------------|
| `--workspaceId` | `-w` | ClickUpのワークスペースID（必須） | - |
| `--docId` | `-d` | エクスポートするClickUpドキュメントのID（必須） | - |
| `--apiKey` | `-k` | ClickUp APIキー | 環境変数 `CLICKUP_API_TOKEN` |
| `--outputDir` | `-o` | Markdown出力先ディレクトリ | `./clickup_docs_export` |
| `--help` | `-h` | ヘルプを表示 | - |

### 環境変数

セキュリティ向上のため、APIキーは環境変数として設定することを推奨します：

```bash
export CLICKUP_API_TOKEN=your_api_key_here
```

## 出力形式

エクスポートされたデータは以下の形式で保存されます：

- 各ドキュメントのコンテンツは `[ページ名].md` として保存
- 各ドキュメントのメタデータは `[ページ名].meta.json` として保存
- サブページはサブディレクトリとして保存され、階層構造を維持

## 例

```bash
# 環境変数にAPIキーを設定した場合
node clickup-markdown-exporter.js -w 1234567 -d abcdef

# APIキーを直接指定する場合
node clickup-markdown-exporter.js -w 1234567 -d abcdef -k your_api_key

# カスタム出力ディレクトリを指定
node clickup-markdown-exporter.js -w 1234567 -d abcdef -o ./my_docs
```

## 注意事項

- ページ名に特殊文字が含まれる場合、ファイル名として安全な形式に変換されます
- ページ名が存在しない場合は、ページIDをファイル名として使用します

## トラブルシューティング

エラーが発生した場合は、以下を確認してください：

1. APIキーが正しく設定されているか
2. ワークスペースIDとドキュメントIDが正しいか
3. 十分な権限があるか（APIキーに対象ドキュメントへのアクセス権があるか）

## ライセンス

[MITライセンス](LICENSE)
