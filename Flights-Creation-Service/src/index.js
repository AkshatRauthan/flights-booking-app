const express = require("express");
const app = express();

const { ServerConfig, Logger, QueueConfig } = require("./config");
// const { connectQueue } = require("./config/queue-config");
const apiRoutes = require("./routes");



app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`\n\nSuccessfully started the server on port ${ServerConfig.PORT}`);
});

