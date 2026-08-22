// ===== Загрузка проектов с GitHub API =====
const GITHUB_USER = "unwind0440-source";
const grid = document.getElementById("projects-grid");

async function loadProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=6&sort=updated`);
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const repos = await res.json();

    grid.innerHTML = "";

    if (repos.length === 0) {
      grid.innerHTML = `
        <div class="card">
          <h3>Пока пусто</h3>
          <p>Проекты скоро появятся — следите за обновлениями на GitHub.</p>
          <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">Перейти на GitHub →</a>
        </div>`;
      return;
    }

    repos.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || "Без описания")}</p>
        <a href="${repo.html_url}" target="_blank" rel="noopener">Открыть на GitHub →</a>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `
      <div class="card">
        <h3>Не удалось загрузить проекты</h3>
        <p>${escapeHtml(err.message)}</p>
        <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">Смотреть на GitHub →</a>
      </div>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

// ===== Валидация и отправка формы =====
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "";
  status.textContent = "";

  let valid = true;
  const fields = [
    { el: form.name, min: 2, msg: "Имя должно содержать минимум 2 символа" },
    { el: form.email, min: 0, msg: "Введите корректный email" },
    { el: form.message, min: 10, msg: "Сообщение должно содержать минимум 10 символов" },
  ];

  fields.forEach(({ el, min, msg }) => {
    el.classList.remove("invalid");
    const value = el.value.trim();
    let ok = value.length >= min;
    if (ok && el.type === "email") {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (!ok) {
      el.classList.add("invalid");
      if (valid) {
        status.textContent = msg;
        status.classList.add("error");
      }
      valid = false;
    }
  });

  if (!valid) return;

  // Демо-отправка: без бэкенда просто показываем успех
  status.textContent = "Спасибо! Сообщение отправлено (демо-режим).";
  status.classList.add("success");
  form.reset();
});

// ===== Запуск =====
loadProjects();