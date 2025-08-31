// -------- File Encryption/Decryption --------
const encryptionForm = document.querySelector("#encryptionForm");
const decryptionForm = document.querySelector("#decryptionForm");
const downloadEncryptedFile = document.querySelector("#downloadEncryptedFile");
const downloadDecryptedFile = document.querySelector("#downloadDecryptedFile");
const messageElmts = document.querySelectorAll(".message");

let encryptedFileTimeoutId;
let decryptedFileTimeoutId;

// Helper to show a message and auto-hide
function showMessage(mode, text, duration = 5000) {
  const messageEl = [...messageElmts].find((el) => el.dataset.mode === mode);
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.style.display = "block";
  setTimeout(() => {
    messageEl.style.display = "none";
  }, duration);
}

// Encrypt file
// Encrypt file
encryptionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(encryptionForm);

  try {
    const response = await fetch("/api/encryptFile", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      downloadEncryptedFile.href = `${data.downloadUrl}`;

      downloadEncryptedFile.textContent = "Download Encrypted File";
      downloadEncryptedFile.style.display = "inline-block";
      showMessage("encryptFile", "File encrypted successfully.");

      // Hide link after 1 minute
      encryptedFileTimeoutId = setTimeout(() => {
        downloadEncryptedFile.style.display = "none";
      }, 60000);

      downloadDecryptedFile.style.display = "none";
    } else {
      showMessage("encryptFile", data.message || "Encryption failed.");
      downloadEncryptedFile.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    showMessage("encryptFile", "Encryption request failed.");
  }

  encryptionForm.reset();
});

// Decrypt file
decryptionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(decryptionForm);

  try {
    const response = await fetch("/api/decryptFile", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      downloadDecryptedFile.href = `${data.downloadUrl}`;

      downloadDecryptedFile.textContent = "Download Decrypted File";
      downloadDecryptedFile.style.display = "inline-block";
      showMessage("decryptFile", "File decrypted successfully.");

      // Hide link after 1 minute
      decryptedFileTimeoutId = setTimeout(() => {
        downloadDecryptedFile.style.display = "none";
      }, 60000);

      downloadEncryptedFile.style.display = "none";
    } else {
      showMessage("decryptFile", data.message || "Decryption failed.");
      downloadDecryptedFile.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    showMessage("decryptFile", "Decryption request failed.");
  }

  decryptionForm.reset();
});

// text encryption and decryption
const encryptionTextForm = document.querySelector("#encryptionTextForm");
const decryptionTextForm = document.querySelector("#decryptionTextForm");
const encryptedTextArea = document.querySelector("#encryptedText");
const decryptedTextArea = document.querySelector("#decryptedText");
const copyEncryptedBtn = document.querySelector("#copyEncryptedBtn");
const copyDecryptedBtn = document.querySelector("#copyDecryptedBtn");
const outputContainer = document.querySelectorAll(".outputContainer");

outputContainer.forEach((container) => {
  container.style.display = "none";
});

function showTextMessage(el, text, duration = 5000) {
  if (!el) return;
  el.textContent = text;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), duration);
}

// Encrypt text
encryptionTextForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(encryptionTextForm);
  const values = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/encryptText", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (data.success) {
      showTextMessage(
        document.querySelector('[data-mode="encryptText"]'),
        "Text encrypted successfully."
      );

      // Reset inputs only
      encryptionTextForm.querySelector("#encryptionText").value = "";
      encryptionTextForm.querySelector("#textEncryptionKey").value = "";

      outputContainer.forEach((container) => {
        container.style.display = "block";
      });

      encryptedTextArea.style.display = "block";
      copyEncryptedBtn.style.display = "inline-block";
      encryptedTextArea.value = data.encryptedText;
    } else {
      showTextMessage(
        document.querySelector('[data-mode="encryptText"]'),
        data.message || "Text encryption failed."
      );
      encryptedTextArea.style.display = "none";
      copyEncryptedBtn.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    showTextMessage(
      document.querySelector('[data-mode="encryptText"]'),
      "Text encryption request failed."
    );
    encryptedTextArea.style.display = "none";
    copyEncryptedBtn.style.display = "none";
  }
});

// Decrypt text
decryptionTextForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(decryptionTextForm);
  const values = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/decryptText", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();

    outputContainer.forEach((container) => {
      container.style.display = "block";
    });

    if (data.success) {
      showTextMessage(
        document.querySelector('[data-mode="decryptText"]'),
        "Text decrypted successfully."
      );

      decryptionTextForm.querySelector("#decryptionText").value = "";
      decryptionTextForm.querySelector("#textDecryptionKey").value = "";

      decryptedTextArea.style.display = "block";
      copyDecryptedBtn.style.display = "inline-block";
      decryptedTextArea.value = data.decryptedText;
    } else {
      showTextMessage(
        document.querySelector('[data-mode="decryptText"]'),
        data.message || "Text decryption failed."
      );
      decryptedTextArea.style.display = "none";
      copyDecryptedBtn.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    showTextMessage(
      document.querySelector('[data-mode="decryptText"]'),
      "Text decryption request failed."
    );
    decryptedTextArea.style.display = "none";
    copyDecryptedBtn.style.display = "none";
  }
});

// Copy encrypted text
copyEncryptedBtn.addEventListener("click", () => {
  encryptedTextArea.select();
  navigator.clipboard.writeText(encryptedTextArea.value);
  showTextMessage(
    document.querySelector('[data-mode="encryptText"]'),
    "Copied to clipboard!"
  );
});

// Copy decrypted text
copyDecryptedBtn.addEventListener("click", () => {
  decryptedTextArea.select();
  navigator.clipboard.writeText(decryptedTextArea.value);
  showTextMessage(
    document.querySelector('[data-mode="decryptText"]'),
    "Copied to clipboard!"
  );
});
