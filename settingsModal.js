class settingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.innerHTML = `<dialog id="customize-modal">
     <h2> Hello! </h2>
      </dialog >`;
  }
}

customElements.define("settings-modal", settingsModal);
