#!/usr/bin/env node

import fs from "fs"
import FtpDeploy from "ftp-deploy"

const auth = JSON.parse(fs.readFileSync("./.ftpauth", "utf8"))

const {user, password, host, port, root} = auth;
const ftpDeploy = new FtpDeploy();

const config = {
    user,
    password,
    host,
    port,
    localRoot: "./src",
    remoteRoot: root,
    include: ["**/*", ".*"],
    deleteRemote: true,
    forcePasv: true
}

ftpDeploy.on("uploading", function (data) {
    console.log(data.filename); // partial path with filename being uploaded
});

ftpDeploy
    .deploy(config)
    .then(res => console.log(`Uploading finished!`))
    .catch(err => console.log(err))