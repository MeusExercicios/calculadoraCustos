function verificarLogin() {
  const email = document.getElementById("email").value;

  // Verificar se o email contém o caractere "@"
  if (!email.includes("@")) {
    // Se o email não contiver "@", exibir uma mensagem de erro
    alert("Por favor, digite um email válido.");
    return; // Evitar envio do formulário se o email for inválido
  }

  // Se o email for válido, enviar o formulário
  window.location.href = "./escolhaUmaOpcao.html";
}
