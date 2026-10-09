const timetable = require("../data/timetable");

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

function timetableAgent() {

    const today = getCurrentDay();
    const currentMinutes = getCurrentMinutes();

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

        const startMinutes = timeToMinutes(
            classItem.startTime
        );

        const difference = startMinutes - currentMinutes;

        // Alert 30 minutes before class
        if (difference >= 0 && difference <= 30) {

            const message =
                `🔔 University Class Alert\n\n` +
                `📚 Subject: ${classItem.subject}\n` +
                `🕣 Time: ${classItem.startTime} - ${classItem.endTime}\n\n` +
                `Your class starts in approximately ${difference} minutes.\n` +
                `🎓 Get ready!`;

            return message;
        }

        // Class currently running
        const endMinutes = timeToMinutes(
            classItem.endTime
        );

        if (
            currentMinutes >= startMinutes &&
            currentMinutes < endMinutes
        ) {

            const message =
                `🎓 Class Reminder\n\n` +
                `📚 ${classItem.subject}\n` +
                `🕣 ${classItem.startTime} - ${classItem.endTime}\n\n` +
                `Your class is currently running.`;

            return message;
        }
    }

    console.log("No alert required right now.");

    return null;
}

module.exports = timetableAgent;