// utils.js
const moment = require('moment');

exports.formatPostAge = (date) => {
    const now = moment();
    const postTime = moment(date);
    const duration = moment.duration(now.diff(postTime));

    if (duration.asMinutes() < 1) {
        return '1m'; // Edge case for posts created less than a minute ago
    } else if (duration.asHours() < 1) {
        return `${Math.ceil(duration.asMinutes())}m`;
    } else if (duration.asDays() < 1) {
        return `${Math.ceil(duration.asHours())}h`;
    } else if (duration.asMonths() < 1) {
        return `${Math.ceil(duration.asDays())}d`;
    } else if (duration.asYears() < 1) {
        return `${Math.ceil(duration.asMonths())}mo`;
    } else {
        return `${Math.ceil(duration.asYears())}y`;
    }
};
