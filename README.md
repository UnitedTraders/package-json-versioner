# package-json-versioner

Takes package.json and copies to given directory. Of package.json version ends with `snapshot` appends dot and timestamp.
For example, version `1.0-SNAPSHOT` becomes `1.0-SNAPSHOT.1494248012112`.

```
Usage: package-json-versioner <destination-dir>
```

Can be used with npm build script like this:
```
...
"scripts": {
  "build": "babel ./src --out-dir ./dist && package-json-versioner ./dist",
  "publish": "npm publish dist"
},
...
```
