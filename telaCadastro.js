function cadastrarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Verificar se as senhas coincidem
  if (password !== confirmPassword) {
    alert("As senhas não coincidem. Por favor, tente novamente.");
    return;
  }

  // Verificar se o email contém o caractere "@"
  if (!email.includes("@")) {
    alert("Por favor, digite um email válido.");
    return;
  }

  // Simular cadastro (aqui você poderia enviar os dados para um servidor)
  alert(`Usuário ${nome} cadastrado com sucesso!`);

  // Redirecionar para a página de login após cadastro bem-sucedido
  window.location.href = "./index.html";
}
