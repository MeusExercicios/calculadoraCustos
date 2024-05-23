function verificarLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    alert("Email ou senha inválidos.");
    return;
  }

  window.location.href = "./escolhaUmaOpcao.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const cadastroLink = document.getElementById("cadastroLink");

  cadastroLink.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./cadastro.html"; // Redireciona para a página de cadastro
  });
});
