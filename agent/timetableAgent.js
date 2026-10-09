const timetable = require("../data/timetable");

const reminderMinutesValue = process.env.REMINDER_MINUTES ?? "30";

if (!/^\d+$/.test(reminderMinutesValue)) {
    throw new Error("REMINDER_MINUTES must be a non-negative integer.");
}

const reminderMinutes = Number(reminderMinutesValue);
const maxAlertsPerClass = 3;
const alertCounts = new Map();
let alertDate;

if (!Number.isSafeInteger(reminderMinutes)) {
    throw new Error("REMINDER_MINUTES must be a non-negative safe integer.");
}

function getCurrentDay() {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long"
    });
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(":");

    return Number(hours) * 60 + Number(minutes);
}

function getCurrentMinutes() {
    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();
}

function getCurrentDateKey() {
    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function getClassKey(classItem) {
    return `${classItem.subject}|${classItem.startTime}|${classItem.endTime}`;
}

function timetableAgent() {

    const today = getCurrentDay();
    const currentMinutes = getCurrentMinutes();
    const currentDate = getCurrentDateKey();

    if (currentDate !== alertDate) {
        alertCounts.clear();
        alertDate = currentDate;
    }

    console.log("================================");
    console.log("University Timetable Agent");
    console.log("Today:", today);
    console.log("================================");

    const todayClasses = timetable.filter(
        item => item.day === today
    );

    if (todayClasses.length === 0) {
        console.log("No classes today.");
        return null;
    }

    for (const classItem of todayClasses) {
        const classKey = getClassKey(classItem);
        const alertCount = alertCounts.get(classKey) ?? 0;

        const startMinutes = timeToMinutes(
            classItem.startTime
        );

        const difference = startMinutes - currentMinutes;

        // Alert within the configured number of minutes before class
        if (
            difference >= 0 &&
            difference <= reminderMinutes &&
            alertCount < maxAlertsPerClass
        ) {

            const message =
                `🔔 University Class Alert\n\n` +
                `📚 Subject: ${classItem.subject}\n` +
                `🕣 Time: ${classItem.startTime} - ${classItem.endTime}\n\n` +
                `Your class starts in approximately ${difference} minutes.\n` +
                `🎓 Get ready!`;

            alertCounts.set(classKey, alertCount + 1);
            return message;
        }

        // Class currently running
        const endMinutes = timeToMinutes(
            classItem.endTime
        );

        if (
            currentMinutes >= startMinutes &&
            currentMinutes < endMinutes &&
            alertCount < maxAlertsPerClass
        ) {

            const message =
                `🎓 Class Reminder\n\n` +
                `📚 ${classItem.subject}\n` +
                `🕣 ${classItem.startTime} - ${classItem.endTime}\n\n` +
                `Your class is currently running.`;

            alertCounts.set(classKey, alertCount + 1);
            return message;
        }
    }

    console.log("No alert required right now.");

    return null;
}

module.exports = timetableAgent;