
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const token = '7940442049:AAGHknk1SoDuAkPZYfICd0dmfXGqPnHZrXQ';
const chatId = '6012419452';

// Load URLs from urls.json
const urls = JSON.parse(fs.readFileSync('./urls.json', 'utf8')).urls;

const oldHashes = {};

async function checkUrls() {
  for (let url of urls) {
    try {
      const response = await axios.get(url);
      const content = response.data;

      const newHash = crypto.createHash('md5').update(content).digest('hex');

      if (oldHashes[url] && oldHashes[url] !== newHash) {
        await sendTelegramNotification(`⚠️ Content changed at URL:\n${url}`);
      }

      oldHashes[url] = newHash;
    } catch (error) {
      console.log(`Error fetching ${url}:`, error.message);
    }
  }
}

async function sendTelegramNotification(message) {
  const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  await axios.post(apiUrl, {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  });
}

// Run every 5 minutes
setInterval(checkUrls, 5 * 60 * 1000);

// Run immediately on start too
checkUrls();
