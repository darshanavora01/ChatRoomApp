const moment = require('moment')

function customMessages(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = customMessages;