class settingsModal extends HTMLElements {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
     <dialog id="customize-modal">
        <h2>Hello!</h2>
      </dialog> 
     `;

    let dialog = this.shadowRoot.querySelector("dialog"); // Get the dialog element here
    openSettings.addEventListener("click", () => {
      dialog.showModal(); // Call showModal() on the dialog element
    });
  }
}

customElements.define("settings-modal", settingsModal);
