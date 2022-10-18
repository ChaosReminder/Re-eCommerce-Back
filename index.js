const server = require('./src/app')
const mongooseConection = require('./src/database/db')

const port = process.env.PORT || 3001

server.listen(port, ()=> {
    console.log(`server running on port : ${PORT}`)
    mongooseConection()
})
