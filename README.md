# MLS Practice

practice with MLS encryption, using
[openmls](https://github.com/openmls/openmls) project compiled to WASM.

No app integration here on purpose.

## Run it

Console version:

```bash
npm install
node --experimental-wasm-modules practice.mjs
```

Browser version (same Alice/Bob DM, click Send instead of reading console output):

```bash
npm install
npm run dev
```
