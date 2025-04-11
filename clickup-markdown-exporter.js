const fs = require('fs').promises;
const path = require('path');

const clickup = require('@api/clickup');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const sanitize = require('sanitize-filename');

/**
 * 階層的なページ構造からMarkdownファイルを作成する
 * @param {Object} page - ページオブジェクト
 * @param {string} basePath - 基本ディレクトリパス
 */
async function processPage(page, basePath) {
    if (!page.name) {
        // console.error('ページに必要な名前プロパティがありません');
        // return;
        page.name = page.id
    }

    // ページ名から安全なファイル名を作成
    const safeName = sanitize(page.name)

    // コンテンツがある場合、マークダウンファイルとして保存
    if (page.content) {
        const mdFilePath = path.join(basePath, `${safeName}.md`);
        await fs.writeFile(mdFilePath, page.content);
        console.log(`"${page.name}"のコンテンツを${mdFilePath}に保存しました`);

        // page を deep copy して pages プロパティを削除
        const pageCopy = JSON.parse(JSON.stringify(page));
        delete pageCopy.pages;

        // page.jsonを保存
        const jsonFilePath = path.join(basePath, `${safeName}.meta.json`);
        await fs.writeFile(jsonFilePath, JSON.stringify(pageCopy, null, 2));
        console.log(`"${pageCopy.name}"のメタデータを${jsonFilePath}に保存しました`);
    }

    // サブページを再帰的に処理
    if (page.pages && Array.isArray(page.pages) && page.pages.length > 0) {
        // サブページ用のサブディレクトリを作成
        const subDirPath = path.join(basePath, safeName);
        await fs.mkdir(subDirPath, { recursive: true });

        for (const subpage of page.pages) {
            await processPage(subpage, subDirPath);
        }
    }
}

/**
 * JSONページ配列を処理してコンテンツをマークダウンファイルとして保存
 * @param {string} jsonFilePath - JSONファイルへのパス
 * @param {string} outputDir - 出力ディレクトリパス
 */
async function convertJsonToMarkdown(pages, outputDir = './output') {
    try {
        if (!Array.isArray(pages)) {
            throw new Error('JSONデータはPageオブジェクトの配列である必要があります');
        }

        // 各ページを処理
        for (const page of pages) {
            await processPage(page, outputDir);
        }

        console.log(`すべてのページを${outputDir}に正常に処理しました`);
        return true;
    } catch (error) {
        console.error('JSONからマークダウンへの処理中にエラーが発生しました:', error);
        throw error;
    }
}

async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('apiKey', {
            alias: 'k',
            description: 'ClickUp API Key (推奨: 環境変数 CLICKUP_API_TOKEN を使用)',
            type: 'string',
            default: process.env.CLICKUP_API_TOKEN, // 環境変数から取得
        })
        .option('workspaceId', {
            alias: 'w',
            description: 'ClickUp Workspace ID',
            type: 'string',
            demandOption: true, // 必須オプション
        })
        .option('docId', {
            alias: 'd',
            description: 'Target ClickUp Doc ID',
            type: 'string',
            demandOption: true, // 必須オプション
        })
        .option('outputDir', {
            alias: 'o',
            description: 'Output directory for Markdown files',
            type: 'string',
            default: './clickup_docs_export',
        })
        .check((argv) => {
            // APIキーが引数でも環境変数でも指定されていない場合はエラー
            if (!argv.apiKey) {
                throw new Error('API Key is required. Provide it via --apiKey or CLICKUP_API_TOKEN environment variable.');
            }
            return true;
        })
        .usage('Usage: $0 -w <workspaceId> -d <docId> [-k <apiKey>] [-o <outputDir>]')
        .help()
        .alias('help', 'h')
        .argv;

    const { apiKey, workspaceId, docId, outputDir } = argv;

    clickup.auth(apiKey);

    const data = await clickup.getDocPages({
        max_page_depth: '-1',
        content_format: 'text%2Fmd',
        workspaceId: workspaceId,
        docId: docId
    })

    // save data json
    // fs.writeFileSync('data.json', JSON.stringify(data.data, null, 2));

    await convertJsonToMarkdown(data.data, outputDir)
}

main();
