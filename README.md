### Usage

First run, `npm install`.
After that finishes, run `npm link`. This will add a command to your global npm bin folder that can be used system wide.
If the npm bin folder isn't added to your PATH, find the path by running `npm bin -g` and add that to your PATH variable.


This script requires two args: inputFilename and an outputFilename.

Ex.

```js
node index.js ./test.properties ./test.yaml
```

or if you ran `npm link` and have this package available globally:
```js
prop2yaml ./example.properties ./example.yaml
```

> Note: The yaml file will be created for you and will be overridden if it exists initially
