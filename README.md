# MLS Practice

Hands-on practice with real MLS (Messaging Layer Security), using the
[openmls](https://github.com/openmls/openmls) project compiled to WASM.

No app integration here on purpose. Just proving the mechanics work before
touching Gachahub's actual chat code.

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

Then open the printed `localhost` URL. Two columns, Alice and Bob, plus a middle
column showing exactly what a backend would see: raw ciphertext, nothing else.

**Known limit (this only works for 2 people):** the `openmls-wasm` package used
here is an early/experimental binding. It has no way for an existing member to
process a Commit someone else made, so adding a third person breaks the first
member's ability to decrypt anything after that point. Real group support
needs building the actual `openmls` Rust project to WASM directly, which is
the current next step.

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
