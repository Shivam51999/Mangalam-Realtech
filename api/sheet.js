// Optional Vercel proxy — only needed if direct browser → Apps Script calls
// hit CORS issues in your setup. Set APPS_SCRIPT_URL below, deploy to Vercel,
// then set CONFIG.API_URL = '/api/sheet' in index.html.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxLY149NJD5Hh-G5AVNC9-kBMufrPExam_hsWyAeeLzIxzmORBTEs3WIe6rkrI7zqL6/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let url = APPS_SCRIPT_URL;
    const qs = new URLSearchParams(req.query).toString();
    if (req.method === 'GET' && qs) url += (url.includes('?') ? '&' : '?') + qs;

    const upstream = await fetch(url, {
      method: req.method,
      redirect: 'follow', // Apps Script replies with a 302 chain
      headers: req.method === 'POST' ? { 'Content-Type': 'text/plain;charset=utf-8' } : undefined,
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const text = await upstream.text();
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
