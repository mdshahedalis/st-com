const app = require("./app");
const DB = require("./config/datasource");
const port = process.env.PORT


DB.initialize().then(() => {
    console.log("DB connected");
    app.listen(port, ()=>{
    console.log(`server is running on port http://localhost:${port}`);
    })
  })
.catch(console.error);