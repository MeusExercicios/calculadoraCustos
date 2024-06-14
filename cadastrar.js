document.addEventListener("DOMContentLoaded", function () {
  const botaoNovoProduto = document.getElementById("botaoNovoProduto");
  botaoNovoProduto.addEventListener("click", adicionarCampos);

  const botaoConsultarProduto = document.getElementById(
    "botaoConsultarProduto"
  );
  botaoConsultarProduto.addEventListener("click", consultarProdutos);
});

function adicionarCampos() {
  const pai = document.getElementById("cadastrar");

  // Limpar conteúdo anterior, se houver
  pai.innerHTML = "";

  // Criar elementos para cadastrar o produto
  const nomeProduto = document.createElement("input");
  nomeProduto.type = "text";
  nomeProduto.placeholder = "Nome do produto";

  // Adicionar campo para peso ou volume do produto
  const pesoVolumeProduto = document.createElement("input");
  pesoVolumeProduto.type = "number";
  pesoVolumeProduto.placeholder = "Peso ou volume do produto";

  // Criar dropdown para selecionar a unidade do produto
  const unidadeProduto = document.createElement("select");
  const unidades = ["kg", "g", "l", "ml", "unidade"];
  unidades.forEach((unidade) => {
    const option = document.createElement("option");
    option.value = unidade;
    option.text = unidade;
    unidadeProduto.appendChild(option);
  });

  // Criar botão de confirmação
  const botaoConfirmar = document.createElement("button");
  botaoConfirmar.innerText = "Confirmar";
  botaoConfirmar.addEventListener("click", function () {
    if (nomeProduto.value !== "" && pesoVolumeProduto.value !== "") {
      adicionarIngrediente(
        nomeProduto.value,
        parseFloat(pesoVolumeProduto.value),
        unidadeProduto.value
      );
    } else {
      alert(
        "Por favor, preencha o nome do produto e o peso/volume antes de continuar."
      );
    }
  });

  // Adicionar elementos ao DOM
  pai.appendChild(nomeProduto);
  pai.appendChild(pesoVolumeProduto);
  pai.appendChild(unidadeProduto);
  pai.appendChild(botaoConfirmar);
}

function adicionarIngrediente(nomeProduto, pesoVolumeProduto, unidadeProduto) {
  const pai = document.getElementById("cadastrar");
  pai.innerHTML = ""; // Limpar conteúdo anterior, se houver

  const ingredientes = [];

  function criarCampoEntrada(labelText, inputType, inputPlaceholder, parent) {
    const label = document.createElement("label");
    label.innerText = labelText;
    const input = document.createElement("input");
    input.type = inputType;
    input.placeholder = inputPlaceholder;
    parent.appendChild(label);
    parent.appendChild(input);
    return input;
  }

  function criarDropdown(labelText, options, parent) {
    const label = document.createElement("label");
    label.innerText = labelText;
    const select = document.createElement("select");
    options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.text = optionText;
      select.appendChild(option);
    });
    parent.appendChild(label);
    parent.appendChild(select);
    return select;
  }

  function criarBotao(labelText, parent, callback) {
    const button = document.createElement("button");
    button.innerText = labelText;
    button.addEventListener("click", callback);
    parent.appendChild(button);
    return button;
  }

  function perguntarIngrediente() {
    pai.innerHTML = "";

    const nomeIngrediente = criarCampoEntrada(
      "Nome do Ingrediente:",
      "text",
      "Nome do Ingrediente",
      pai
    );

    const unidadesPossiveisCompra = ["kg", "g", "l", "ml", "unidade"];
    const unidadeCompra = criarDropdown(
      "Unidade de Compra:",
      unidadesPossiveisCompra,
      pai
    );

    const quantidadeCompra = criarCampoEntrada(
      "Quantidade Comprada:",
      "number",
      "Quantidade Comprada",
      pai
    );

    const precoIngrediente = criarCampoEntrada(
      "Preço Total:",
      "number",
      "Preço Total",
      pai
    );

    const unidadeUso = criarDropdown(
      "Unidade de Uso:",
      unidadesPossiveisCompra,
      pai
    );

    const quantidadeUsada = criarCampoEntrada(
      "Quantidade Usada:",
      "number",
      "Quantidade Usada",
      pai
    );

    const botaoAdicionar = criarBotao(
      "Adicionar Ingrediente",
      pai,
      function () {
        if (
          nomeIngrediente.value &&
          unidadeCompra.value &&
          quantidadeCompra.value &&
          precoIngrediente.value &&
          unidadeUso.value &&
          quantidadeUsada.value
        ) {
          ingredientes.push({
            nome: nomeIngrediente.value,
            unidadeCompra: unidadeCompra.value,
            quantidadeCompra: parseFloat(quantidadeCompra.value),
            preco: parseFloat(precoIngrediente.value),
            unidadeUso: unidadeUso.value,
            quantidadeUsada: parseFloat(quantidadeUsada.value),
          });
          perguntarAdicionarMaisIngredientes();
        } else {
          alert("Por favor, preencha todos os campos.");
        }
      }
    );

    const botaoCancelar = criarBotao("Cancelar", pai, function () {
      finalizarCadastro(
        nomeProduto,
        pesoVolumeProduto,
        unidadeProduto,
        ingredientes
      );
    });
  }

  function perguntarAdicionarMaisIngredientes() {
    pai.innerHTML = "";

    const pergunta = document.createElement("p");
    pergunta.innerText = "Deseja adicionar outro ingrediente?";
    pai.appendChild(pergunta);

    const botaoSim = criarBotao("Sim", pai, perguntarIngrediente);

    const botaoNao = criarBotao("Não", pai, function () {
      finalizarCadastro(
        nomeProduto,
        pesoVolumeProduto,
        unidadeProduto,
        ingredientes
      );
    });
  }

  perguntarIngrediente();
}

function finalizarCadastro(
  nomeProduto,
  pesoVolumeProduto,
  unidadeProduto,
  ingredientes
) {
  const pai = document.getElementById("cadastrar");
  pai.innerHTML = ""; // Limpar conteúdo anterior, se houver

  let custoTotal = 0;

  ingredientes.forEach((ingrediente) => {
    let custoIngrediente;
    if (ingrediente.unidadeCompra === ingrediente.unidadeUso) {
      custoIngrediente =
        (ingrediente.preco / ingrediente.quantidadeCompra) *
        ingrediente.quantidadeUsada;
    } else {
      // Converter unidade de uso para unidade de compra
      if (
        ingrediente.unidadeCompra === "kg" &&
        ingrediente.unidadeUso === "g"
      ) {
        custoIngrediente =
          (ingrediente.preco / ingrediente.quantidadeCompra) *
          (ingrediente.quantidadeUsada / 1000);
      } else if (
        ingrediente.unidadeCompra === "g" &&
        ingrediente.unidadeUso === "kg"
      ) {
        custoIngrediente =
          (ingrediente.preco / ingrediente.quantidadeCompra) *
          (ingrediente.quantidadeUsada * 1000);
      } else if (
        ingrediente.unidadeCompra === "l" &&
        ingrediente.unidadeUso === "ml"
      ) {
        custoIngrediente =
          (ingrediente.preco / ingrediente.quantidadeCompra) *
          (ingrediente.quantidadeUsada / 1000);
      } else if (
        ingrediente.unidadeCompra === "ml" &&
        ingrediente.unidadeUso === "l"
      ) {
        custoIngrediente =
          (ingrediente.preco / ingrediente.quantidadeCompra) *
          (ingrediente.quantidadeUsada * 1000);
      }
    }
    custoTotal += custoIngrediente;
  });

  const resultado = document.createElement("div");
  resultado.innerText = `O custo total do produto ${nomeProduto} (${pesoVolumeProduto} ${unidadeProduto}) é R$ ${custoTotal.toFixed(
    2
  )}`;
  pai.appendChild(resultado);

  // Salvar o produto no localStorage
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.push({
    nome: nomeProduto,
    pesoVolume: pesoVolumeProduto,
    unidade: unidadeProduto,
    custoTotal: custoTotal,
    ingredientes: ingredientes,
    status: "não vendido",
  });
  localStorage.setItem("produtos", JSON.stringify(produtos));

  const botaoOk = document.createElement("button");
  botaoOk.innerText = "OK";
  botaoOk.addEventListener("click", function () {
    pai.innerHTML = "";
  });
  pai.appendChild(botaoOk);
}

function consultarProdutos() {
  const pai = document.getElementById("cadastrar");
  pai.innerHTML = ""; // Limpar conteúdo anterior, se houver

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  if (produtos.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.innerText = "Não tem nenhum produto cadastrado ainda.";
    pai.appendChild(mensagem);
    return;
  }

  produtos.forEach((produto, index) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.classList.add("produto");

    const titulo = document.createElement("h3");
    titulo.innerText = `${produto.nome} (${produto.pesoVolume} ${produto.unidade}) - ${produto.status}`;
    produtoDiv.appendChild(titulo);

    const listaIngredientes = document.createElement("ul");
    produto.ingredientes.forEach((ingrediente) => {
      const item = document.createElement("li");
      item.innerText = `${ingrediente.nome} - R$ ${ingrediente.preco.toFixed(
        2
      )} (${
        ingrediente.unidadeCompra
      }) - Usado: ${ingrediente.quantidadeUsada.toFixed(2)} ${
        ingrediente.unidadeUso
      }`;
      listaIngredientes.appendChild(item);
    });
    produtoDiv.appendChild(listaIngredientes);

    const custoTotal = document.createElement("p");
    custoTotal.innerText = `Custo Total: R$ ${produto.custoTotal.toFixed(2)}`;
    produtoDiv.appendChild(custoTotal);

    const botaoVenda = document.createElement("button");
    botaoVenda.innerText = "Submeter a Venda";
    botaoVenda.addEventListener("click", () => submeterVenda(index));
    produtoDiv.appendChild(botaoVenda);

    const botaoRemover = document.createElement("button");
    botaoRemover.innerText = "Remover";
    botaoRemover.addEventListener("click", () => removerProduto(index));
    produtoDiv.appendChild(botaoRemover);

    pai.appendChild(produtoDiv);
  });
}

function submeterVenda(index) {
  const pai = document.getElementById("cadastrar");
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const produto = produtos[index];

  pai.innerHTML = ""; // Limpar conteúdo anterior, se houver

  const opcaoVendaLabel = document.createElement("label");
  opcaoVendaLabel.innerText = "Como deseja vender? (inteiro/porção): ";
  const opcaoVendaInput = document.createElement("input");
  opcaoVendaInput.type = "text";
  opcaoVendaInput.placeholder = "inteiro/porção";
  pai.appendChild(opcaoVendaLabel);
  pai.appendChild(opcaoVendaInput);

  const botaoConfirmar = document.createElement("button");
  botaoConfirmar.innerText = "Confirmar";
  botaoConfirmar.addEventListener("click", function () {
    const opcaoVenda = opcaoVendaInput.value.toLowerCase();
    if (opcaoVenda === "inteiro") {
      const lucroLabel = document.createElement("label");
      lucroLabel.innerText = "Quantos por cento deseja lucrar?: ";
      const lucroInput = document.createElement("input");
      lucroInput.type = "number";
      lucroInput.placeholder = "Lucro (%)";
      pai.appendChild(lucroLabel);
      pai.appendChild(lucroInput);

      const botaoCalcular = document.createElement("button");
      botaoCalcular.innerText = "Calcular";
      botaoCalcular.addEventListener("click", function () {
        const lucro = parseFloat(lucroInput.value);
        if (isNaN(lucro)) {
          alert("Valor inválido. Tente novamente.");
          return;
        }
        const precoVenda = produto.custoTotal * (1 + lucro / 100);
        produto.status = `vendendo por R$ ${precoVenda.toFixed(2)}`;
        produtos[index] = produto;
        localStorage.setItem("produtos", JSON.stringify(produtos));
        consultarProdutos();
      });
      pai.appendChild(botaoCalcular);
    } else if (opcaoVenda === "porção") {
      const unidadePorcaoLabel = document.createElement("label");
      unidadePorcaoLabel.innerText = `Qual a unidade da porção? (ex: ${produto.unidade}): `;
      const unidadePorcaoInput = document.createElement("input");
      unidadePorcaoInput.type = "text";
      unidadePorcaoInput.placeholder = "Unidade da porção";
      pai.appendChild(unidadePorcaoLabel);
      pai.appendChild(unidadePorcaoInput);

      const quantidadePorcaoLabel = document.createElement("label");
      quantidadePorcaoLabel.innerText = "Qual a quantidade da porção?: ";
      const quantidadePorcaoInput = document.createElement("input");
      quantidadePorcaoInput.type = "number";
      quantidadePorcaoInput.placeholder = "Quantidade da porção";
      pai.appendChild(quantidadePorcaoLabel);
      pai.appendChild(quantidadePorcaoInput);

      const botaoCalcular = document.createElement("button");
      botaoCalcular.innerText = "Calcular";
      botaoCalcular.addEventListener("click", function () {
        const unidadePorcao = unidadePorcaoInput.value.toLowerCase();
        const quantidadePorcao = parseFloat(quantidadePorcaoInput.value);
        if (isNaN(quantidadePorcao)) {
          alert("Quantidade inválida. Tente novamente.");
          return;
        }

        let custoPorcao;
        if (produto.unidade === unidadePorcao) {
          custoPorcao =
            (produto.custoTotal / produto.pesoVolume) * quantidadePorcao;
        } else {
          if (produto.unidade === "kg" && unidadePorcao === "g") {
            custoPorcao =
              (produto.custoTotal / produto.pesoVolume) *
              (quantidadePorcao / 1000);
          } else if (produto.unidade === "g" && unidadePorcao === "kg") {
            custoPorcao =
              (produto.custoTotal / produto.pesoVolume) *
              (quantidadePorcao * 1000);
          } else if (produto.unidade === "l" && unidadePorcao === "ml") {
            custoPorcao =
              (produto.custoTotal / produto.pesoVolume) *
              (quantidadePorcao / 1000);
          } else if (produto.unidade === "ml" && unidadePorcao === "l") {
            custoPorcao =
              (produto.custoTotal / produto.pesoVolume) *
              (quantidadePorcao * 1000);
          }
        }

        const lucroLabel = document.createElement("label");
        lucroLabel.innerText = "Quantos por cento deseja lucrar?: ";
        const lucroInput = document.createElement("input");
        lucroInput.type = "number";
        lucroInput.placeholder = "Lucro (%)";
        pai.appendChild(lucroLabel);
        pai.appendChild(lucroInput);

        const botaoConfirmarLucro = document.createElement("button");
        botaoConfirmarLucro.innerText = "Confirmar";
        botaoConfirmarLucro.addEventListener("click", function () {
          const lucro = parseFloat(lucroInput.value);
          if (isNaN(lucro)) {
            alert("Valor inválido. Tente novamente.");
            return;
          }
          const precoVenda = custoPorcao * (1 + lucro / 100);
          produto.status = `vendendo por R$ ${precoVenda.toFixed(2)} a porção`;
          produtos[index] = produto;
          localStorage.setItem("produtos", JSON.stringify(produtos));
          consultarProdutos();
        });
        pai.appendChild(botaoConfirmarLucro);
      });
      pai.appendChild(botaoCalcular);
    } else {
      alert("Opção de venda inválida. Tente novamente.");
      return;
    }
  });
  pai.appendChild(botaoConfirmar);
}

function removerProduto(index) {
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.splice(index, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  consultarProdutos();
}
