import requests
import time
import pandas as pd
from bs4 import BeautifulSoup

BOT_TOKEN = "7940442049:AAGHknk1SoDuAkPZYfICd0dmfXGqPnHZrXQ"
CHAT_ID = "6012419452"
CHECK_INTERVAL = 300  # seconds

def send_telegram_alert(message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {
        "chat_id": CHAT_ID,
        "text": message
    }
    requests.post(url, data=data)

def check_urls():
    df = pd.read_csv("cleaned_sections.csv")
    for index, row in df.iterrows():
        url, section = row[0], row[1]
        try:
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            if "sold out" in soup.text.lower() or "unavailable" in soup.text.lower():
                send_telegram_alert(f"⚠️ Section Sold Out: {section}\n🔗 {url}")
        except Exception as e:
            send_telegram_alert(f"❗ Error checking URL: {url}\nError: {e}")

if __name__ == "__main__":
    while True:
        check_urls()
        time.sleep(CHECK_INTERVAL)
