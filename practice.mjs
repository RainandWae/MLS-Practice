// MLS practice, using the real OpenMLS project compiled to WASM.
//
// Mapped onto Gachahub's actual chat model so the concepts stick:
//   Identity        -> one user's device (like a ChatParticipant, but per-device)
//   KeyPackage       -> what the backend would store/serve so others can add you
//   Group            -> a ChatConversation
//   propose_and_commit_add -> adding someone to a DM/group (a new ChatParticipant row)
//   create_message / process_message -> what fills ChatMessage.ciphertext today,
//                                        except it's now REAL ciphertext, not a passthrough

import { Provider, Identity, Group } from "openmls-wasm";

// Each user gets their own Provider: it holds that device's private keys and
// group state, same way each of your users has their own device/session.
const aliceProvider = new Provider();
const bobProvider = new Provider();

const alice = new Identity(aliceProvider, "alice");
const bob = new Identity(bobProvider, "bob");

// Bob publishes this ahead of time. This is exactly the thing your backend
// needs a new endpoint to store and serve (see BACKLOG.md's MLS section).
const bobKeyPackage = bob.key_package(bobProvider);

// Alice starts a conversation. Group id could just be your ChatConversation.id.
const aliceGroup = Group.create_new(aliceProvider, alice, "conversation-1");

// Alice adds Bob. In the real app this is the moment a ChatParticipant row
// gets inserted for Bob.
const { commit, welcome } = aliceGroup.propose_and_commit_add(
  aliceProvider,
  alice,
  bobKeyPackage,
);
aliceGroup.merge_pending_commit(aliceProvider);

// Bob needs the current tree shape plus the Welcome message to join without
// having seen any prior history.
const ratchetTree = aliceGroup.export_ratchet_tree();
const bobGroup = Group.join(bobProvider, welcome, ratchetTree);

console.log("--- group formed ---");
console.log("commit bytes:", commit.length);
console.log("welcome bytes:", welcome.length);

// Alice sends a real message.
const plaintext = "hey bob, this is what a message actually looks like on the wire";
const ciphertext = aliceGroup.create_message(
  aliceProvider,
  alice,
  new TextEncoder().encode(plaintext),
);

console.log("\n--- what your backend would actually store ---");
console.log("ciphertext (base64):", Buffer.from(ciphertext).toString("base64"));
console.log("^ this is what OpaqueMessageEncryptionService would receive as `ciphertext` today");

// Bob decrypts it locally. The backend never does this step.
const decrypted = bobGroup.process_message(bobProvider, ciphertext);

console.log("\n--- what bob's client shows after decrypting ---");
console.log(new TextDecoder().decode(decrypted));
