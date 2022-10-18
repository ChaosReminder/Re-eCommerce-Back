
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const mongooseConection = async () => {
  
    try {
        const db = await mongoose.connect(process.env.Mongo_DB_URL , {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        const url = `${db.connection.host}:${db.connection.port}`
             console.log(`mongo DB conectado en . : ${url}`)
        
    } catch (error) {
        console.log("error",error)
        process.exit(1)
    }
}

module.exports = mongooseConection
