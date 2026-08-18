const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const quoteForm = document.querySelector(".quote-form");
const formStatus = document.querySelector(".form-status");
const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

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

  const whatsappUrl = `https://wa.me/5554981617755?text=${encodeURIComponent(message)}`;
  formStatus?.classList.add("is-visible");
  const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = whatsappUrl;
});
