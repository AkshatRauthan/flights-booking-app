const express = require("express");

const { ServerConfig, Logger } = require("./config")
const apiRoutes = require("./routes");
const { CRONS } = require('./utils/common')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`\nSuccessfully started the server on port ${ServerConfig.PORT}`);
    CRONS();
});

