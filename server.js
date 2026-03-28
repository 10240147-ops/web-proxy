const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h2>Simple Web Proxy</h2>
    <form method="GET" action="/proxy">
      <input type="text" name="url" placeholder="https://example.com" size="50"/>
      <button type="submit">Go</button>
    </form>
  `);
});

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.send("URLが必要です");
  }

  try {
    const response = await fetch(targetUrl);
    const text = await response.text();

    // 簡易的にリンクを書き換え（完全ではない）
    const modified = text.replace(/href="\//g, `href="/proxy?url=${targetUrl}/`);

    res.send(modified);
  } catch (error) {
    res.send("取得エラー: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
