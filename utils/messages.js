const moment = require('moment');

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