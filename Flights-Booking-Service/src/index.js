const express = require("express");

const { ServerConfig, Logger, Queue } = require("./config")
const apiRoutes = require("./routes");
const { CRONS } = require('./utils/common');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`\nSuccessfully started the server on port ${ServerConfig.PORT}`);
    CRONS();
    await Queue.connectQueue();
    console.log('queue connected');
});

