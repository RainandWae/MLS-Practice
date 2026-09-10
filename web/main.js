import { MlsUser } from "./mls-user.js";

const wireLog = document.getElementById("wire-log");

function line(container, text) {
  const div = document.createElement("div");
  div.textContent = text;
  container.appendChild(div);
}

// Alice and Bob are two separate devices, matching a real GachaHub DM
// (ChatConversation with 2 participants). Alice creates it and adds Bob,
// same as createDirectMessage would today.
const alice = new MlsUser("alice");
const bob = new MlsUser("bob");

alice.createConversation("conversation-1");
const { welcome, ratchetTree } = alice.addMember(bob.keyPackage());
bob.joinConversation(welcome, ratchetTree);

function wireUp(sender, recipient, inputId, buttonId, senderLog) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const log = document.getElementById(senderLog);
  const recipientLog = document.getElementById(recipient.name === "alice" ? "alice-log" : "bob-log");

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    const ciphertext = sender.encrypt(text);
    line(log, `you: ${text}`);
    line(wireLog, `[${sender.name} -> ${recipient.name}] ciphertext: ${btoa(String.fromCharCode(...ciphertext)).slice(0, 60)}...`);

    const plaintext = recipient.decrypt(ciphertext);
    line(recipientLog, `${sender.name}: ${plaintext}`);
  });
}

wireUp(alice, bob, "alice-input", "alice-send", "alice-log");
wireUp(bob, alice, "bob-input", "bob-send", "bob-log");
