const moment = require('moment');

// Formats message using moment module
const formatMessage = ({ sender, msg, isPrivate }) => {
    return {
        sender,
        msg,
        isPrivate, 
        moment: moment().format("HH:mm")
    };
}

module.exports = {
    formatMessage
}