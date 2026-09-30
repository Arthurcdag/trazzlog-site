(() => {
  const handoffKey = "trazzlog.whatsapp-handoff";
  const handoffLifetime = 10 * 60 * 1000;
  let message = "";

  function clearHandoff() {
    try {
      sessionStorage.removeItem(handoffKey);
    } catch {
      // Storage may be disabled by the browser.
    }
  }

  try {
    const stored = sessionStorage.getItem(handoffKey);
    const handoff = stored ? JSON.parse(stored) : null;
    const age = handoff ? Date.now() - handoff.createdAt : -1;
    if (handoff && age >= 0 && age < handoffLifetime && typeof handoff.message === "string") {
      message = handoff.message;
      window.setTimeout(clearHandoff, handoffLifetime - age);
    } else {
      clearHandoff();
    }
  } catch {
    clearHandoff();
    // Direct visits and browsers without storage retain the standard contact link.
  }

  if (!message) return;

  document.getElementById("confirmation-title").textContent = "Sua cotação está pronta para enviar.";
  document.getElementById("confirmation-description").textContent =
    "Conclua o envio da mensagem no WhatsApp para nossa equipe receber os dados da carga. Se o WhatsApp não abriu, use o botão abaixo.";

  document.querySelector("[data-whatsapp-continue]").addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    // Do not put form fields in the rendered link: analytics can collect link URLs.
    clearHandoff();
    window.location.assign(`https://wa.me/5554981617755?text=${encodeURIComponent(message)}`);
  });
})();
