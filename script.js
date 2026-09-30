const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formStatus = document.querySelector(".form-status");
const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
const whatsappBaseUrl = "https://wa.me/5554981617755";
const whatsappHandoffKey = "trazzlog.whatsapp-handoff";

function startWhatsappContact(message = "") {
  // Keep the prepared message out of the confirmation URL and analytics data.
  // The confirmation page keeps a short-lived fallback in this same tab.
  try {
    sessionStorage.setItem(whatsappHandoffKey, JSON.stringify({
      message,
      createdAt: Date.now(),
    }));
  } catch {
    // WhatsApp still receives the prepared message when storage is unavailable.
  }

  const whatsappUrl = message
    ? `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`
    : whatsappBaseUrl;

  // Open during the user gesture. A null return with noopener is not proof
  // of a blocked popup; the confirmation page supplies a manual fallback.
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  window.location.assign(new URL("solicitacao-recebida/", window.location.href).href);
}

document.querySelectorAll(`a[href="${whatsappBaseUrl}"]`).forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    startWhatsappContact();
  });
});

document.documentElement.classList.add("motion-ready");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.12 },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

function setMenuOpen(isOpen) {
  if (!menuButton || !siteNav) return;
  siteNav.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

menuButton?.addEventListener("click", () => {
  setMenuOpen(!siteNav?.classList.contains("is-open"));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) setMenuOpen(false);
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(quoteForm);
  const requirements = form.getAll("requirements").join(", ") || "Nenhum informado";
  const read = (name) => String(form.get(name) || "-").trim() || "-";
  const message = [
    "Olá, TRAZZLOG. Gostaria de solicitar uma cotação.",
    "",
    `Nome: ${read("name")}`,
    `Empresa: ${read("company")}`,
    `Telefone: ${read("phone")}`,
    "",
    "Dados da carga:",
    `Origem: ${read("origin")}`,
    `Destino: ${read("destination")}`,
    `Volumes: ${read("volumes")}`,
    `Peso total (kg): ${read("weight")}`,
    `Cubagem total (m³): ${read("volume")}`,
    `Valor NF (R$): ${read("invoice")}`,
    `Tipo de produto: ${read("product")}`,
    `Modalidade: ${read("service")}`,
    `Requisitos: ${requirements}`,
    `Observações: ${read("notes")}`,
  ].join("\n");

  formStatus?.classList.add("is-visible");
  startWhatsappContact(message);
});
