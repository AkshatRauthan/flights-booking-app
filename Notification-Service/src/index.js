const express = require("express");

const { ServerConfig, Logger } = require("./config")
const apiRoutes = require("./routes");

const app = express();

express.use(express.json());
express.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on port ${ServerConfig.PORT}`);
});

