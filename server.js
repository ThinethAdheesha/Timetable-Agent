require("dotenv").config();

const timetableAgent = require("./agent/timetableAgent");
const sendTelegramMessage = require("./services/telegramService");

console.log("🚀 University Alert Agent Started");

async function checkTimetable() {
    console.log("\nChecking timetable...");

    const message = timetableAgent();

    if (message) {
        console.log("\nGenerated Alert:");
        console.log(message);

        await sendTelegramMessage(message);
    } else {
        console.log("No notification needed.");
    }
}

checkTimetable();

setInterval(() => {
    checkTimetable();
}, 60 * 1000);