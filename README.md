# 卒論ダービー管理システム

卒論ダービーの出馬表、予想一覧、最終結果をデータベースで管理するシステムです。

## 機能

- 📋 出馬表の管理（馬番、メンバー名、卒論テーマ、オッズ）
- 🎯 予想の登録と一覧表示（単勝、複勝、3連単、3連複）
- 🎊 最終結果の管理と表示
- 💾 SQLiteデータベースによる永続的なデータ保存
- 🔧 管理ページによるデータベースの直接操作（追加・編集・削除）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. データベースの初期化と初期データの投入

```bash
node init-data.js
```

このコマンドで：
- データベースファイル（`derby.db`）が作成されます
- 初期の出馬データと結果データが投入されます

### 3. サーバーの起動

```bash
npm start
```

または開発モード（自動リロード）で起動：

```bash
npm run dev
```

### 4. ブラウザでアクセス

**トップページ:**
```
http://localhost:3000
```

**管理ページ:**
```
http://localhost:3000/admin.html
```

管理ページでは以下の操作が可能です：
- 出馬表の追加・編集・削除
- 予想の削除
- 最終結果の追加・編集・削除

## API エンドポイント

### 出馬表（Horses）

- `GET /api/horses` - 全出馬データを取得
- `POST /api/horses` - 出馬データを追加
- `PUT /api/horses/:id` - 出馬データを更新
- `DELETE /api/horses/:id` - 出馬データを削除

### 予想（Predictions）

- `GET /api/predictions` - 全予想データを取得
- `POST /api/predictions` - 予想を追加
- `DELETE /api/predictions/:id` - 予想を削除

### 最終結果（Results）

- `GET /api/results` - 全結果データを取得
- `POST /api/results` - 結果を追加/更新
- `DELETE /api/results/:id` - 結果を削除

## データベース構造

### horses テーブル
- `id` (INTEGER PRIMARY KEY)
- `number` (INTEGER UNIQUE) - 馬番
- `name` (TEXT) - メンバー名
- `theme` (TEXT) - 卒論テーマ
- `odds` (REAL) - オッズ
- `created_at` (DATETIME)

### predictions テーブル
- `id` (INTEGER PRIMARY KEY)
- `predictor_name` (TEXT) - 予想者名
- `bet_type` (TEXT) - 券種（単勝、複勝、3連単、3連複）
- `horse_numbers` (TEXT) - 選択した馬番（JSON配列）
- `created_at` (DATETIME)

### results テーブル
- `id` (INTEGER PRIMARY KEY)
- `rank` (INTEGER UNIQUE) - 順位
- `horse_number` (INTEGER) - 馬番
- `horse_name` (TEXT) - メンバー名
- `created_at` (DATETIME)

## ファイル構成

```
.
├── derby_2025.html    # フロントエンド（HTML/CSS/JavaScript）
├── admin.html         # 管理ページ（データベース操作）
├── server.js          # Expressサーバー
├── database.js        # データベース操作
├── init-data.js       # 初期データ投入スクリプト
├── package.json       # 依存関係
├── derby.db          # SQLiteデータベース（自動生成）
└── README.md         # このファイル
```

## 開発

### データベースをリセットしたい場合

```bash
rm derby.db
node init-data.js
```

### 新しい出馬データを追加したい場合

APIを使用するか、直接データベースを操作してください。

## ライセンス

ISC

