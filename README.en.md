# ClickUp Markdown Exporter

A CLI tool for exporting ClickUp documents as Markdown files. This tool preserves the hierarchical structure of your documents and exports them into a local directory structure.

## Features

- Retrieves documents using the ClickUp API
- Maintains document hierarchy in the output directory structure
- Saves metadata for each document as JSON files
- Flexible configuration through command-line options

## Requirements

- Node.js 12.0 or higher
- ClickUp API key

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clickup-markdown-exporter.git
cd clickup-markdown-exporter

# Install dependencies
npm install
```

## Usage

```bash
node clickup-markdown-exporter.js -w <workspaceId> -d <docId> [-k <apiKey>] [-o <outputDir>]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--workspaceId` | `-w` | ClickUp workspace ID (required) | - |
| `--docId` | `-d` | ID of the ClickUp document to export (required) | - |
| `--apiKey` | `-k` | ClickUp API key | Environment variable `CLICKUP_API_TOKEN` |
| `--outputDir` | `-o` | Directory for Markdown output | `./clickup_docs_export` |
| `--help` | `-h` | Display help | - |

### Environment Variables

For better security, it's recommended to set the API key as an environment variable:

```bash
export CLICKUP_API_TOKEN=your_api_key_here
```

## Output Format

Exported data is saved in the following format:

- Document content is saved as `[page_name].md`
- Document metadata is saved as `[page_name].meta.json`
- Subpages are stored in subdirectories, maintaining the hierarchical structure

## Examples

```bash
# Using API key from environment variable
node clickup-markdown-exporter.js -w 1234567 -d abcdef

# Specifying API key directly
node clickup-markdown-exporter.js -w 1234567 -d abcdef -k your_api_key

# With custom output directory
node clickup-markdown-exporter.js -w 1234567 -d abcdef -o ./my_docs
```

## Notes

- Page names with special characters are converted to safe filenames
- If a page has no name, its ID will be used as the filename

## Troubleshooting

If you encounter errors, please check the following:

1. Verify your API key is correctly set
2. Ensure the workspace ID and document ID are correct
3. Confirm you have sufficient permissions (your API key has access to the target documents)

## License

[MIT License](LICENSE)
