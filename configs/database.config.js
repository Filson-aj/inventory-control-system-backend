const mongoose = require('mongoose'),
    { logEvents } = require('../middleware/logger')

module.exports = {// database module
    connnect: async() =>{
        const url = process.env.NODE_ENV === 'production' ? process.env.DB_URI_O : process.env.DB_URI_L
        try {
            mongoose.set('strictQuery', true)

            await mongoose.connect(url, { //make connection to database
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        } catch (err) {
            console.log(`Faiiled to connect to mongo database: ${err}`)
            logEvents(`Falied to connect to mongo database: ${err}`, 'mongoErrLog.log')
        }
    }
}