// const express = require('express');
const { spawn } = require('child_process');
const { Readable } = require('stream');
const { wait, getLogger } = require('./utility');
const path = require('path');
const pidDict = {};
/**
 * 执行sh脚本
 *
 * @param id 脚本id
 * @param res response object
 */
/* eslint-disable no-underscore-dangle, no-await-in-loop */
const execute = async function (id, res,conn) {
  delete require.cache[require.resolve('./config.json')];
  const config = require('./config.json');
  const filePath = config[id];
  // if (!filePath) {
  //   res.sendStatus(404);
  //   return;
  // }
  console.log(`The script:${filePath} with ${id} begin execute`);
  const readable = new Readable();
  readable._read = () => { };
  // readable.pipe(res);
  while (pidDict[id]) {
    readable.push('\nWaiting for another script request.');
    await wait(5000);
  }
  const handle = spawn('sh', [path.resolve(`./routes/scripts/${filePath}`)], {
    // stdio: 'inherit',
    // 仅在当前运行环境为 Windows 时，才使用 shell
    shell: process.platform === 'win32'
  });

  pidDict[id] = handle.pid;
  handle.stdout.on('data', (data) => {
    readable.push(`\n${data}`);
    getLogger(filePath).log(`\n${data}`);
    conn.sendText(data);
  });
  handle.stderr.on('data', (data) => {
    getLogger(filePath).warn(`\n${data}`);
    readable.push(`\n${data}`);
  });
  handle.on('error', (code) => {
    getLogger(filePath).error(`child process error with information: \n${code}`);
    readable.push(`child process error with information: \n${code}`);
    delete pidDict[id];
    readable.push(null);
  });
  handle.on('close', (code) => {
    getLogger(filePath).log(`child process close with code ${code}`);
    delete pidDict[id];
    readable.push(null);
  });
};

module.exports = execute;