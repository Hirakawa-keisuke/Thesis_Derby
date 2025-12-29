const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, horsesDB, predictionsDB, resultsDB } = require('./database');

const app = express();
const PORT = 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// データベース初期化
initDatabase().then(() => {
    console.log('データベースの初期化が完了しました');
}).catch(err => {
    console.error('データベース初期化エラー:', err);
});

// ========== 出馬表API ==========
// 全取得
app.get('/api/horses', async (req, res) => {
    try {
        const horses = await horsesDB.getAll();
        res.json(horses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/results/:id', async (req, res) => {
    try {
        const result = await resultsDB.update(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 追加
app.post('/api/horses', async (req, res) => {
    try {
        const horse = await horsesDB.add(req.body);
        res.status(201).json(horse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 更新
app.put('/api/horses/:id', async (req, res) => {
    try {
        const horse = await horsesDB.update(req.params.id, req.body);
        res.json(horse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 削除
app.delete('/api/horses/:id', async (req, res) => {
    try {
        const result = await horsesDB.delete(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== 予想API ==========
// 全取得
app.get('/api/predictions', async (req, res) => {
    try {
        const predictions = await predictionsDB.getAll();
        res.json(predictions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 追加
app.post('/api/predictions', async (req, res) => {
    try {
        const prediction = await predictionsDB.add(req.body);
        res.status(201).json(prediction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 削除
app.delete('/api/predictions/:id', async (req, res) => {
    try {
        const result = await predictionsDB.delete(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== 最終結果API ==========
// 全取得
app.get('/api/results', async (req, res) => {
    try {
        const results = await resultsDB.getAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 追加/更新
app.post('/api/results', async (req, res) => {
    try {
        const result = await resultsDB.upsert(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 削除
app.delete('/api/results/:id', async (req, res) => {
    try {
        const result = await resultsDB.delete(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// HTMLファイルを提供
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'derby_2025.html'));
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
    console.log(`サーバーが起動しました`);
    console.log(`ローカル: http://localhost:${PORT}`);
    // console.log(`Tailscale: http://${ip}:${PORT}`);
});

