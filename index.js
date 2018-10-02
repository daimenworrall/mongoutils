/*
  Mongodb Utils
  Daimen Worrall
  daimen@worrall.pw
*/
const exec = require('child_process').exec;
const parseURL = require('url').parse;

exports.parseMongoUrl = function(url) {
    let parsedURL = parseURL(url);
    let info = {};
    info.protocol = parsedURL.protocol || "mongodb";
    info.hostname = parsedURL.hostname || "localhost";
    info.port = parsedURL.port || 27017;
    info.host = info.port ? "" + info.hostname + ":" + info.port : info.hostname;
    info.database = info.db = parsedURL.pathname && parsedURL.pathname.replace(/\//g, '');
    if (parsedURL.auth) {
      let auth = parsedURL.auth.split(':');
      info.username = auth[0];
      info.password = auth[1];
    }
    if (parsedURL.query) {
      let params = parsedURL.query.split("&");
      params.forEach(function(element) {
        if (element.split("=")[0] == "authSource") info.authenticationDatabase = element.split("=")[1];
      })
    }
    return info;
}

exports.createDumpCommand = function(info, out) {
  let command = `mongodump --db ${info.db} --host ${info.host} --out ${out}`;
  if (info.username) command = `${command} --username ${info.username}`;
  if (info.password) command = `${command} --password ${info.password}`;
  if (info.authenticationDatabase) command = `${command} --authenticationDatabase ${info.authenticationDatabase}`;
  return command;
}

exports.createRestoreCommand = function(info, dir) {
  let command = `mongorestore --db ${info.db} --host ${info.host}`;
  if (info.username) command = `${command} --username ${info.username}`;
  if (info.password) command = `${command} --password ${info.password}`;
  if (info.authenticationDatabase) command = `${command} --authenticationDatabase ${info.authenticationDatabase}`;
  command = `${command} ${dir}`;
  return command;
}

exports.executeCommand = function(command, out, err) {
  return new Promise(function(resolve, reject) {
    let spawn = exec(command);
    if (out) spawn.stdout.on('data', out);
    if (err) spawn.stderr.on('data', err);

    spawn.on('close', function() {
      resolve();
    });
  });
}

function exists(command) {
  return new Promise(function(resolve, reject) {
    let spawn = exec(`which ${command}`);
    let data = null;

    spawn.stdout.on('data', function(out) {
      data = out;
    });
    spawn.stderr.on('data', function(error) {
      return reject(error);
    });

    spawn.on('close', function() {
      resolve(data ? true : false);
    });
  });
}

exports.checkInstalled = function() {
  return new Promise(function(resolve, reject) {
    Promise.all([ exists("mongodump"), exists("mongorestore") ])
      .then(function(result) {
        if (result[0] == false || result[1] == false) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch(function(error) {
        reject(error);
      })
  });
}
