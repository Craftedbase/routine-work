# GitHub Pages 公開手順

このアプリは静的ファイルだけで動くため、GitHub Pagesで公開できます。

## 方法1: ブラウザから手動アップロード

1. GitHubで新しいリポジトリを作成する
   - 例: `morning-routine-quest`
   - Public または Private はどちらでも可
2. このフォルダ内のファイルをリポジトリへアップロードする
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `service-worker.js`
   - `images` フォルダ
   - `README.md`
   - `requirements.md`
   - `implementation_plan.md`
   - `DEPLOY.md`
   - `.nojekyll`
3. GitHubのリポジトリ画面で `Settings` を開く
4. 左メニューの `Pages` を開く
5. `Build and deployment` の `Source` を `Deploy from a branch` にする
6. `Branch` を `main`、フォルダを `/ (root)` にして保存する
7. 数十秒から数分後、PagesのURLが表示される

## PWAとして使う

GitHub PagesのURLをChromeやEdgeで開くと、ブラウザのメニューからアプリとしてインストールできます。

`file://` で直接開く場合も通常利用はできますが、Service Workerはブラウザ仕様により動作しないため、ホーム画面追加とオフラインキャッシュはGitHub PagesやlocalhostなどHTTP(S)配信時に使ってください。

## 注意

- データはブラウザの `localStorage` に保存されます。
- GitHub Pagesで公開しても、ユーザーごとのデータは各端末のブラウザ内に保存されます。
- 保護者コードも端末内の簡易ロックです。公開ページにサーバー保存やログイン機能はありません。
- Service Worker更新後に古い画面が残る場合は、ブラウザで強制再読み込みしてください。
