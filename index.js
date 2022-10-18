const server = require('./src/app')
const mongooseConection = require('./src/database/db')

const port = process.env.port || 3001

server.listen(port, ()=> {
    console.log(`server running on port : ${port}`)
    mongooseConection()
})
