const app = require("./app")
const { PORT } = process.env

const startApp = () => {
  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
  })
}

startApp()