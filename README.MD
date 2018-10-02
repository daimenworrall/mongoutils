# mongoutils
### Intro
A collection of utilities to make and restore backups via mongodump and mongorestore. mongodump and mongorestore must be installed on your system to use this.

### Including
```javascript
const mongoutils = require('mongoutils');
```

### API

#### parseMongoUrl(url)
Return the object required for creating dump/restore commands. General mongodb url format accepted (eg: `mongodb://localhost:27017/mydatabase`).
```javascript
  const url = "mongodb://localhost/test";
  let info = mongoutils.parseMongoUrl(url);
```

#### createDumpCommand(parsedUrl, outDir)
Generate the mongodump command.
```javascript
  let command = mongoutils.createDumpCommand(info, './dump');
```

#### createRestoreCommand(parsedUrl, inDir)
Generate the mongorestore command.
```javascript
  let command = mongoutils.createRestoreCommand(info, './dump/test');
```

#### executeCommand(command)
Execute a generated command.
```javascript
  mongoutils.executeCommand(command, function(out) { console.log("OUT", out); }, function(err) { console.log("ERROR", err); })
    .then(function(result) {
      console.log(result);
    })
    .catch(function(error) {
      throw error;
    })
```
The `out` and `err` functions are optional. If you wish to use `err` but not `out`, set `out` to null.

#### checkInstalled()
Returns true if mongodump/mongorestore if installed on the system. Returns false if not.
```javascript
  mongoutils.checkInstalled()
    .then(function(result) {
      console.log(result); //true/false
    })
    .catch(function(error) {
      console.log(error);
    });
```
