const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const mongooseConection = async () => {
  
    try {
        const db = await mongoose.connect(process.env.Mongo_DB_URL , {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        console.log("MONGONNECTED TO " + process.env.Mongo_DB_URL)
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = mongooseConection
