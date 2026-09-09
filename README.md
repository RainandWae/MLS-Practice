# MLS Practice

Hands-on practice with real MLS (Messaging Layer Security), using the
[openmls](https://github.com/openmls/openmls) project compiled to WASM.

No app integration here on purpose. Just proving the mechanics work before
touching Gachahub's actual chat code.

## Run it

```bash
npm install
node --experimental-wasm-modules practice.mjs
```

## What it does

Two identities, Alice and Bob, form a 2-person MLS group and exchange one
real encrypted message:

1. Bob generates a `KeyPackage` (his public prekey — this is the thing
   Gachahub's backend would need a new endpoint to store/serve).
2. Alice creates a group and adds Bob via `propose_and_commit_add`, which
   produces a Commit and a Welcome message.
3. Bob joins using the Welcome plus the exported ratchet tree, without
   having seen any group history.
4. Alice encrypts a message. The printed ciphertext is exactly what would
   sit in `ChatMessage.ciphertext` today, opaque either way.
5. Bob decrypts it locally. The backend never does this step.

See Gachahub's `BACKLOG.md` (Client-side message encryption section) for
why MLS was picked over a simpler hybrid-encryption scheme.
