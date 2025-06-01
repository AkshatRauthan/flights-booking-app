const express = require("express");

const { ServerConfig, Logger } = require("./config")
const { CronJobs } = require("./utils/common"); 

const apiRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

CronJobs.scheduleCrons();

app.listen(ServerConfig.PORT, () => {
    console.log(`\n\nSuccessfully started the server on port ${ServerConfig.PORT}`);
});

