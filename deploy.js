#!/usr/bin/env node

import fs from "fs"
import FtpDeploy from "ftp-deploy"

const auth = JSON.parse(fs.readFileSync("./.ftpauth", "utf8"))

const {user, password, host, port} = auth;
const ftpDeploy = new FtpDeploy();

const config = {
    user,
    password,
    host,
    port,
    localRoot: "./src",
    remoteRoot: "panda.metroui.org.ua/",
    include: ["**/*", ".*"],
    deleteRemote: true,
    forcePasv: true
}

ftpDeploy
    .deploy(config)
    .then(res => console.log(res))
    .catch(err => console.log(err))