// リズム地獄ランキング用 Apps Script
// スプレッドシート「リズム地獄ランキング」に記録をためるウェブアプリ

const SPREADSHEET_ID = '1tFF2easG_c6wdTlr7WgEtpve1dA202k4aioOORHKrwo';
const SHEET_NAME = 'シート1';

function sheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function rows_() {
  const v = sheet_().getDataRange().getValues();
  v.shift(); // 見出し行
  return v.map(r => ({
    name: String(r[1]), game: String(r[2]), label: String(r[3]), lv: Number(r[4]),
    score: Number(r[5]), ch: String(r[6]), key: String(r[7]), ts: Number(r[8])
  }));
}

// 記録を1行追加する
function doPost(e) {
  const d = JSON.parse((e.postData && e.postData.contents) || '{}');
  const name = String(d.name || '名無し').slice(0, 10);
  const score = Math.max(0, Math.min(10000000, Math.floor(Number(d.score) || 0)));
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([
      new Date(), name, String(d.game || '').slice(0, 20), String(d.label || '').slice(0, 40),
      Number(d.lv) || 0, score, String(d.ch || '').slice(0, 20), String(d.key || '').slice(0, 40),
      Number(d.ts) || Date.now()
    ]);
  } finally {
    lock.releaseLock();
  }
  return out_({ ok: true });
}

// a=rank&key=…  : そのステージ・レベルのランキング
// a=hist&name=… : その人の記録
// a=total       : みんなの記録（合計ポイント用）
function doGet(e) {
  const p = e.parameter || {};
  const a = p.a || 'rank';
  const rs = rows_();
  if (a === 'rank') return out_(rs.filter(r => r.key === p.key).sort((x, y) => y.score - x.score).slice(0, 300));
  if (a === 'hist') return out_(rs.filter(r => r.name === p.name).sort((x, y) => y.ts - x.ts).slice(0, 300));
  if (a === 'total') return out_(rs.map(r => ({ name: r.name, score: r.score })));
  return out_([]);
}
