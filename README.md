# 卒論ダービー管理システム

卒論ダービーの出馬表、予想一覧、最終結果をデータベースで管理し、リアルタイムでレース状況を楽しめるWebアプリケーションです。

## 機能

* 📋 **出馬表の管理**: 馬番、メンバー名、卒論テーマ、オッズの登録・編集
* 🎯 **予想の登録**: ユーザーによる予想登録（単勝、複勝、3連単、3連複）
* 🎊 **結果発表**: 最終順位の登録と表示
* 🏆 **的中判定**: 結果確定時に、的中者を自動判別して一覧表示
* 💾 **データ保存**: SQLiteデータベースによる永続的な管理
* 🔧 **管理ページ**: データベースの直接操作（追加・編集・削除）が可能な専用画面
* 📱 **レスポンシブ**: スマートフォンやタブレットでも見やすいデザイン

## セットアップ

### 1. 依存関係のインストール

```bash
npm install

```

### 2. データベースの初期化と初期データの投入

```bash
node init-data.js

```

※ 初回起動時やデータをリセットしたい時に実行します。`derby.db` ファイルが作成されます。

### 3. サーバーの起動

```bash
node server.js

```

または開発モード（`nodemon` 使用時）：

```bash
npm run dev

```

### 4. ブラウザでアクセス

* **トップページ (一般ユーザー用):**
`http://localhost:3000`
* **管理ページ (管理者用):**
`http://localhost:3000/admin.html`

## API エンドポイント

### 出馬表（Horses）

* `GET /api/horses` - 全出馬データを取得
* `POST /api/horses` - 出馬データを新規追加
* `PUT /api/horses/:id` - 出馬データを更新
* `DELETE /api/horses/:id` - 出馬データを削除

### 予想（Predictions）

* `GET /api/predictions` - 全予想データを取得
* `POST /api/predictions` - 予想を新規追加
* `DELETE /api/predictions/:id` - 予想を削除

### 最終結果（Results）

* `GET /api/results` - 全結果データを取得
* `POST /api/results` - 結果を新規追加
* `PUT /api/results/:id` - 結果データを更新（順位や馬情報の修正）
* `DELETE /api/results/:id` - 結果を削除

## データベース構造 (SQLite)

### `horses` テーブル

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | 自動採番ID |
| `number` | INTEGER | 馬番（ユニーク） |
| `name` | TEXT | メンバー名 |
| `theme` | TEXT | 卒論テーマ |
| `odds` | REAL | オッズ |
| `created_at` | DATETIME | 作成日時 |

### `predictions` テーブル

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | 自動採番ID |
| `predictor_name` | TEXT | 予想者名 |
| `bet_type` | TEXT | 券種（単勝/複勝/3連単/3連複） |
| `horse_numbers` | TEXT | 選択した馬番（JSON形式の配列文字列） |
| `created_at` | DATETIME | 作成日時 |

### `results` テーブル

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | 自動採番ID |
| `rank` | INTEGER | 順位（ユニーク） |
| `horse_number` | INTEGER | 馬番 |
| `horse_name` | TEXT | メンバー名（スナップショット） |
| `created_at` | DATETIME | 作成日時 |

## ファイル構成

```
.
├── derby_2025.html    # メインページ（出馬表・予想・結果・的中者表示）
├── admin.html         # 管理ページ（データのCRUD操作）
├── server.js          # Node.jsサーバーエントリーポイント
├── database.js        # SQLiteデータベース操作ロジック
├── init-data.js       # 初期データ投入用スクリプト
├── package.json       # プロジェクト設定・依存パッケージ
└── derby.db           # SQLiteデータベースファイル（自動生成）

```

## トラブルシューティング

### データベースをリセットしたい場合

データがおかしくなった場合は、データベースファイルを削除して再生成してください。

```bash
rm derby.db
node init-data.js

```

### ポートが使用中の場合

`Error: listen EADDRINUSE: address already in use :::3000` と表示される場合は、他のプロセスがポート3000を使用しています。別のポートを指定するか、既存のプロセスを終了してください。