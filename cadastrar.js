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

  function perguntarIngrediente() {
    const nomeIngrediente = prompt("Qual o nome do ingrediente?");
    if (!nomeIngrediente) return;

    const unidadeCompra = prompt(
      "Qual a unidade de medida da compra? (kg, g, l, ml, unidade)"
    ).toLowerCase();
    if (!["kg", "g", "l", "ml", "unidade"].includes(unidadeCompra)) {
      alert("Unidade inválida. Tente novamente.");
      return;
    }

    const pesoVolumeTotal = parseFloat(
      prompt(
        `Qual o ${
          unidadeCompra === "kg" || unidadeCompra === "g" ? "peso" : "volume"
        } total do ingrediente comprado (${unidadeCompra})?`
      )
    );
    if (isNaN(pesoVolumeTotal)) {
      alert("Valor inválido. Tente novamente.");
      return;
    }

    const precoIngrediente = parseFloat(
      prompt("Qual o preço total do ingrediente comprado?")
    );
    if (isNaN(precoIngrediente)) {
      alert("Valor inválido. Tente novamente.");
      return;
    }

    const quantidadeUsada = parseFloat(
      prompt("Quanto do ingrediente foi usado?")
    );
    if (isNaN(quantidadeUsada)) {
      alert("Valor inválido. Tente novamente.");
      return;
    }

    const unidadeUsada = prompt(
      "Qual a unidade de medida usada? (kg, g, l, ml, unidade)"
    ).toLowerCase();
    if (!["kg", "g", "l", "ml", "unidade"].includes(unidadeUsada)) {
      alert("Unidade inválida. Tente novamente.");
      return;
    }

    ingredientes.push({
      nome: nomeIngrediente,
      unidadeCompra: unidadeCompra,
      pesoVolumeTotal: pesoVolumeTotal,
      preco: precoIngrediente,
      quantidadeUsada: quantidadeUsada,
      unidadeUsada: unidadeUsada,
    });

    const continuar = confirm("Deseja adicionar outro ingrediente?");
    if (continuar) {
      perguntarIngrediente();
    } else {
      finalizarCadastro(
        nomeProduto,
        pesoVolumeProduto,
        unidadeProduto,
        ingredientes
      );
    }
  }

  perguntarIngrediente();
}

function finalizarCadastro(
  nomeProduto,
  pesoVolumeProduto,
  unidadeProduto,
  ingredientes
) {
  let custoTotal = 0;

  ingredientes.forEach((ingrediente) => {
    const pesoVolumeCompra = ingrediente.pesoVolumeTotal; // Peso ou volume total do ingrediente comprado
    let fatorConversaoCompra = 1;
    if (
      ingrediente.unidadeCompra === "kg" ||
      ingrediente.unidadeCompra === "l"
    ) {
      fatorConversaoCompra = 1000; // Converter para gramas ou mililitros
    }

    let fatorConversaoUsada = 1;
    if (ingrediente.unidadeUsada === "kg" || ingrediente.unidadeUsada === "l") {
      fatorConversaoUsada = 1000; // Converter para gramas ou mililitros
    }

    const custoIngrediente =
      (ingrediente.preco / (pesoVolumeCompra * fatorConversaoCompra)) *
      (ingrediente.quantidadeUsada * fatorConversaoUsada);
    custoTotal += custoIngrediente;
  });

  alert(
    `O custo total do produto ${nomeProduto} (${pesoVolumeProduto} ${unidadeProduto}) é R$ ${custoTotal.toFixed(
      2
    )}`
  );

  // Salvar o produto no localStorage
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.push({
    nome: nomeProduto,
    pesoVolume: pesoVolumeProduto,
    unidade: unidadeProduto,
    custoTotal: custoTotal,
    ingredientes: ingredientes,
  });
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function consultarProdutos() {
  const pai = document.getElementById("cadastrar");
  pai.innerHTML = ""; // Limpar conteúdo anterior, se houver

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  if (produtos.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.innerText = "Nenhum produto cadastrado.";
    pai.appendChild(mensagem);
    return;
  }

  produtos.forEach((produto) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.classList.add("produto");

    const titulo = document.createElement("h3");
    titulo.innerText = `${produto.nome} (${produto.pesoVolume} ${produto.unidade})`;
    produtoDiv.appendChild(titulo);

    const listaIngredientes = document.createElement("ul");
    produto.ingredientes.forEach((ingrediente) => {
      const item = document.createElement("li");
      item.innerText = `${ingrediente.nome} - R$ ${ingrediente.preco.toFixed(
        2
      )} (${
        ingrediente.unidadeCompra
      }) - Usado: ${ingrediente.quantidadeUsada.toFixed(2)} ${
        ingrediente.unidadeUsada
      }`;
      listaIngredientes.appendChild(item);
    });
    produtoDiv.appendChild(listaIngredientes);

    const custoTotal = document.createElement("p");
    custoTotal.innerText = `Custo Total: R$ ${produto.custoTotal.toFixed(2)}`;
    produtoDiv.appendChild(custoTotal);

    pai.appendChild(produtoDiv);
  });
}
