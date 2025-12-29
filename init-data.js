const { initDatabase, horsesDB, resultsDB } = require('./database');

// 初期データ
const initialHorses = [
    { number: 1, name: '山田太郎', theme: 'AIによる画像認識の高度化', odds: 3.5 },
    { number: 2, name: '佐藤花子', theme: '環境に優しい新素材の開発', odds: 5.2 },
    { number: 3, name: '鈴木一郎', theme: '量子コンピュータの実用化研究', odds: 2.8 },
    { number: 4, name: '田中美咲', theme: '地域活性化のためのSNS活用', odds: 7.1 },
    { number: 5, name: '伊藤健太', theme: 'ブロックチェーン技術の応用', odds: 4.3 },
    { number: 6, name: '渡辺舞', theme: '高齢者向けロボット開発', odds: 6.5 },
    { number: 7, name: '中村隆', theme: '再生可能エネルギーの効率化', odds: 3.9 },
    { number: 8, name: '小林愛', theme: 'VR技術を用いた教育システム', odds: 5.8 }
];

const initialResults = [
    { rank: 1, horse_number: 3, horse_name: '鈴木一郎' },
    { rank: 2, horse_number: 1, horse_name: '山田太郎' },
    { rank: 3, horse_number: 7, horse_name: '中村隆' }
];

async function initializeData() {
    try {
        console.log('データベースを初期化しています...');
        await initDatabase();
        
        console.log('初期データを投入しています...');
        
        // 出馬データを投入
        for (const horse of initialHorses) {
            try {
                await horsesDB.add(horse);
                console.log(`✓ 出馬データ追加: ${horse.number}番 ${horse.name}`);
            } catch (err) {
                if (err.message.includes('UNIQUE constraint')) {
                    console.log(`- 出馬データは既に存在: ${horse.number}番 ${horse.name}`);
                } else {
                    console.error(`✗ 出馬データ追加エラー: ${horse.number}番`, err.message);
                }
            }
        }
        
        // 結果データを投入
        for (const result of initialResults) {
            try {
                await resultsDB.upsert(result);
                console.log(`✓ 結果データ追加: ${result.rank}位 ${result.horse_name}`);
            } catch (err) {
                console.error(`✗ 結果データ追加エラー: ${result.rank}位`, err.message);
            }
        }
        
        console.log('\n初期データの投入が完了しました！');
        process.exit(0);
    } catch (error) {
        console.error('初期化エラー:', error);
        process.exit(1);
    }
}

initializeData();

