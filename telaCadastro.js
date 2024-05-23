function cadastrarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem. Por favor, tente novamente.");
    return;
  }

  if (!email.includes("@")) {
    alert("Por favor, digite um email válido.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("Usuário já cadastrado com esse email.");
    return;
  }

  users.push({ nome, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert(`Usuário ${nome} cadastrado com sucesso!`);

  window.location.href = "./index.html";
}
