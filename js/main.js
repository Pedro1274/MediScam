// Funcionalidade do Menu Mobile
const menuMobile = document.querySelector(".menu-mobile");
const menu = document.querySelector(".menu");

menuMobile.addEventListener("click", () => {
  menuMobile.classList.toggle("active");
  menu.classList.toggle("active");

  // Update nos atributos ARIA
  const isExpanded = menuMobile.getAttribute("aria-expanded") === "true";
  menuMobile.setAttribute("aria-expanded", !isExpanded);
});

// Formulário de Agendamento
const appointmentForm = document.getElementById("appointment-form");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset de erros anteriores
    clearErrors();

    // Validação completa
    const isValid = validateForm();

    if (isValid) {
      // Simulação de envio (substituir por fetch/axios na implementação real)
      showSuccessMessage();
      appointmentForm.reset();
    }
  });
}

function validateForm() {
  let isValid = true;

  // Validação do Nome
  const name = document.getElementById("name");
  if (!name.value.trim() || name.value.trim().length < 3) {
    showError(
      name,
      "Por favor, insira seu nome completo (mínimo 3 caracteres)"
    );
    isValid = false;
  }

  // Validação do E-mail
  const email = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError(email, "Por favor, insira um e-mail válido");
    isValid = false;
  }

  // Validação do Telefone
  const phone = document.getElementById("phone");
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  if (!phoneRegex.test(phone.value)) {
    showError(phone, "Formato esperado: (DD) 99999-9999");
    isValid = false;
  }

  // Validação da Especialidade
  const specialty = document.getElementById("specialty");
  if (!specialty.value) {
    showError(specialty, "Por favor, selecione uma especialidade");
    isValid = false;
  }

  // Validação da Data
  const date = document.getElementById("date");
  const selectedDate = new Date(date.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!date.value || selectedDate < today) {
    showError(date, "Por favor, selecione uma data futura");
    isValid = false;
  }

  return isValid;
}

function showError(field, message) {
  const formGroup = field.closest(".form-group");
  const errorElement = document.createElement("span");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.id = `${field.id}-error`;
  errorElement.setAttribute("role", "alert");
  errorElement.setAttribute("aria-live", "assertive");

  // Adiciona classe de erro ao campo
  field.classList.add("error");
  field.setAttribute("aria-invalid", "true");

  // Remove mensagens de erro anteriores
  const existingError = formGroup.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Insere a mensagem de erro
  formGroup.appendChild(errorElement);

  // Foca no primeiro campo com erro
  if (!formGroup.querySelector(":focus")) {
    field.focus();
  }
}

function clearErrors() {
  // Remove todas as mensagens de erro
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Remove classes de erro
  document.querySelectorAll(".error").forEach((el) => {
    el.classList.remove("error");
    el.removeAttribute("aria-invalid");
  });
}

function showSuccessMessage() {
  // Cria elemento de sucesso
  const successElement = document.createElement("div");
  successElement.className = "success-message";
  successElement.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Agendamento enviado com sucesso! Entraremos em contato para confirmar.</p>
  `;
  successElement.setAttribute("role", "status");
  successElement.setAttribute("aria-live", "polite");

  // Insere antes do formulário
  appointmentForm.parentNode.insertBefore(successElement, appointmentForm);

  // Remove após 5 segundos
  setTimeout(() => {
    successElement.remove();
  }, 5000);
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Carregamento lazy para imagens
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute("loading");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  }
});
