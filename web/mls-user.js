// One MLS device. Wraps Provider + Identity + Group so the demo code
// doesn't repeat the same four openmls-wasm calls for every person.
import { Provider, Identity, Group } from "openmls-wasm";

export class MlsUser {
  constructor(name) {
    this.name = name;
    this.provider = new Provider();
    this.identity = new Identity(this.provider, name);
    this.group = null;
  }

  keyPackage() {
    return this.identity.key_package(this.provider);
  }

  createConversation(conversationId) {
    this.group = Group.create_new(this.provider, this.identity, conversationId);
  }

  // Adds a member and returns what a real backend would need to relay:
  // a Welcome for the new member, and the current tree shape.
  addMember(memberKeyPackage) {
    const { welcome } = this.group.propose_and_commit_add(
      this.provider,
      this.identity,
      memberKeyPackage,
    );
    this.group.merge_pending_commit(this.provider);
    return { welcome, ratchetTree: this.group.export_ratchet_tree() };
  }

  joinConversation(welcome, ratchetTree) {
    this.group = Group.join(this.provider, welcome, ratchetTree);
  }

  encrypt(text) {
    return this.group.create_message(this.provider, this.identity, new TextEncoder().encode(text));
  }

  decrypt(ciphertext) {
    const bytes = this.group.process_message(this.provider, ciphertext);
    return new TextDecoder().decode(bytes);
  }
}
