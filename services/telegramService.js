require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
    if (!botToken || !chatId) {
        console.error("Telegram configuration is missing.");
        return null;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
        })
    });

    const data = await response.json();

    if (!data.ok) {
        throw new Error(data.description || "Telegram send failed.");
    }

    return data;
}

module.exports = sendTelegramMessage;