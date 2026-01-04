const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'derby.db');

// データベース接続を取得
function getDB() {
    return new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('データベース接続エラー:', err.message);
        } else {
            console.log('データベースに接続しました');
        }
    });
}

// データベースの初期化
function initDatabase() {
    const db = getDB();
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 出馬表テーブル
            db.run(`
                CREATE TABLE IF NOT EXISTS horses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    number INTEGER UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    theme TEXT NOT NULL,
                    jockey TEXT,
                    odds REAL NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('horsesテーブル作成エラー:', err);
                    reject(err);
                } else {
                    // 既存のテーブルに騎手カラムを追加（マイグレーション）
                    db.run(`ALTER TABLE horses ADD COLUMN jockey TEXT`, (alterErr) => {
                        // エラーは無視（カラムが既に存在する場合）
                    });
                }
            });

            // 予想テーブル
            db.run(`
                CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    predictor_name TEXT NOT NULL,
                    bet_type TEXT NOT NULL,
                    horse_numbers TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('predictionsテーブル作成エラー:', err);
                    reject(err);
                }
            });

            // 最終結果テーブル
            db.run(`
                CREATE TABLE IF NOT EXISTS results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rank INTEGER NOT NULL,
                    horse_number INTEGER NOT NULL,
                    horse_name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(rank)
                )
            `, (err) => {
                if (err) {
                    console.error('resultsテーブル作成エラー:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

// 出馬表の操作
const horsesDB = {
    // 全取得
    getAll: () => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.all('SELECT * FROM horses ORDER BY number', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
                db.close();
            });
        });
    },

    // 追加
    add: (horse) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run(
                'INSERT INTO horses (number, name, theme, jockey, odds) VALUES (?, ?, ?, ?, ?)',
                [horse.number, horse.name, horse.theme, horse.jockey || null, horse.odds],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...horse });
                    db.close();
                }
            );
        });
    },

    // 更新
    update: (id, horse) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run(
                'UPDATE horses SET number = ?, name = ?, theme = ?, jockey = ?, odds = ? WHERE id = ?',
                [horse.number, horse.name, horse.theme, horse.jockey || null, horse.odds, id],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...horse });
                    db.close();
                }
            );
        });
    },

    // 削除
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run('DELETE FROM horses WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
                db.close();
            });
        });
    }
};

// 予想の操作
const predictionsDB = {
    // 全取得
    getAll: () => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.all('SELECT * FROM predictions ORDER BY created_at DESC', (err, rows) => {
                if (err) reject(err);
                else {
                    // horse_numbersを配列に変換
                    const predictions = rows.map(row => ({
                        ...row,
                        numbers: JSON.parse(row.horse_numbers)
                    }));
                    resolve(predictions);
                }
                db.close();
            });
        });
    },

    // 追加
    add: (prediction) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run(
                'INSERT INTO predictions (predictor_name, bet_type, horse_numbers) VALUES (?, ?, ?)',
                [prediction.predictor_name, prediction.bet_type, JSON.stringify(prediction.numbers)],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...prediction });
                    db.close();
                }
            );
        });
    },

    // 削除
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run('DELETE FROM predictions WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
                db.close();
            });
        });
    }
};

// 最終結果の操作
const resultsDB = {
    // 全取得
    getAll: () => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.all('SELECT * FROM results ORDER BY rank', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
                db.close();
            });
        });
    },

    // 追加/更新
    upsert: (result) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run(
                `INSERT INTO results (rank, horse_number, horse_name) 
                 VALUES (?, ?, ?)
                 ON CONFLICT(rank) DO UPDATE SET
                 horse_number = excluded.horse_number,
                 horse_name = excluded.horse_name`,
                [result.rank, result.horse_number, result.horse_name],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...result });
                    db.close();
                }
            );
        });
    },

    // 更新
    update: (id, result) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run(
                'UPDATE results SET rank = ?, horse_number = ?, horse_name = ? WHERE id = ?',
                [result.rank, result.horse_number, result.horse_name, id],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id, ...result });
                    db.close();
                }
            );
        });
    },

    // 削除
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const db = getDB();
            db.run('DELETE FROM results WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes });
                db.close();
            });
        });
    }
};

module.exports = {
    initDatabase,
    horsesDB,
    predictionsDB,
    resultsDB
};

