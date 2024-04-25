// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRouter = require("./routes/auth.routes");       //  <== IMPORT
const { isAuthenticated } = require("./middleware/jwt.middleware");
app.use("/auth", authRouter);     



app.use('/api',require('./routes/task.routes'))
app.use('/api',require('./routes/projects.routes'))


// regular middleware function
app.use((req,res,next)=>{
    console.log("MY Regular Middleware")

    next()
})

// Errro handling middleware function

/* app.use((error,req,res,next)=>{
    console.log("error handling middleware " + error)

    next()
})
 */
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
