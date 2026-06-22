const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const contactResult = document.querySelector("[data-contact-result]");
const volumesInput = document.querySelector("[data-volumes]");
const cubageInput = document.querySelector("[data-cubage]");
const totalCubageInput = document.querySelector("[data-total-cubage]");
const matrixWhatsappUrl = "https://wa.me/5554981617755";
const quoteEmailUrl = "mailto:operacional@trazzlog.com.br?cc=coletas@trazzlog.com.br,coletassp@trazzlog.com.br";

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    }
  });
}

if (contactForm && contactResult) {
  const updateTotalCubage = () => {
    if (!volumesInput || !cubageInput || !totalCubageInput) return;

    const volumes = Number(volumesInput.value);
    const cubage = Number(String(cubageInput.value).replace(",", "."));

    if (volumes > 0 && cubage > 0) {
      totalCubageInput.value = (volumes * cubage).toFixed(3);
    }
  };

  volumesInput?.addEventListener("input", updateTotalCubage);
  cubageInput?.addEventListener("input", updateTotalCubage);

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(contactForm);
    const getField = (name) => String(form.get(name) || "").trim() || "-";
    const requirements = form.getAll("requirements").map(String);
    const name = getField("name");
    const company = getField("company");
    const subject = encodeURIComponent("Solicitação de cotação TRAZZLOG");
    const message = [
      `Nome: ${name}`,
      `Empresa: ${company}`,
      "",
      "Dados da carga:",
      `Origem: ${getField("origin")}`,
      `Destino: ${getField("destination")}`,
      `Volumes: ${getField("volumes")}`,
      `Peso total (kg): ${getField("weight")}`,
      `Cubagem por volume (m³): ${getField("cubage")}`,
      `Cubagem total (m³): ${getField("totalCubage")}`,
      `Valor NF (R$): ${getField("invoiceValue")}`,
      `Tipo de produto: ${getField("productType")}`,
      `Modalidade: ${getField("serviceType")}`,
      `Requisitos: ${requirements.length ? requirements.join(", ") : "-"}`,
      "",
      `Observações: ${getField("details")}`,
    ].join("\n");
    const body = encodeURIComponent(message);
    const whatsappText = encodeURIComponent(message);
    const whatsappUrl = `${matrixWhatsappUrl}?text=${whatsappText}`;
    const emailUrl = `${quoteEmailUrl}&subject=${subject}&body=${body}`;

    contactResult.classList.add("success");
    contactResult.innerHTML = `Abrindo conversa no WhatsApp da matriz. Se não abrir, <a href="${whatsappUrl}" target="_blank" rel="noreferrer">clique aqui</a> ou <a href="${emailUrl}">envie por e-mail</a>.`;

    const opened = window.open(whatsappUrl, "_blank", "noopener");
    if (!opened) {
      window.location.href = whatsappUrl;
    }
  });
}
