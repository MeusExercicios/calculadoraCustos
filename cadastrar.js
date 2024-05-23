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
  const ingredientes = [];

  // Função para adicionar ingredientes
  function adicionarIngredientePrompt() {
    const nomeIngrediente = prompt("Qual é o nome do ingrediente?");
    if (nomeIngrediente) {
      const unidadeCompra = prompt(
        `Qual é a unidade de compra de ${nomeIngrediente}? (kg, g, ml, l, unidade)`
      );
      const pesoVolumeIngrediente = parseFloat(
        prompt(
          `Qual é o peso/volume total de ${nomeIngrediente} que você comprou?`
        )
      );
      const precoIngrediente = parseFloat(
        prompt(`Quanto você pagou pelo ${nomeIngrediente}?`)
      );
      const quantidadeUsada = parseFloat(
        prompt(`Quanto de ${nomeIngrediente} você usou?`)
      );
      const unidadeUsada = prompt(
        `Qual é a unidade de medida de ${nomeIngrediente} que você usou? (kg, g, ml, l, unidade)`
      );

      ingredientes.push({
        nome: nomeIngrediente,
        unidadeCompra: unidadeCompra,
        pesoVolumeTotal: pesoVolumeIngrediente,
        preco: precoIngrediente,
        quantidadeUsada: quantidadeUsada,
        unidadeUsada: unidadeUsada,
      });

      const adicionarOutro = confirm("Deseja adicionar outro ingrediente?");
      if (adicionarOutro) {
        adicionarIngredientePrompt();
      } else {
        finalizarCadastro(
          nomeProduto,
          pesoVolumeProduto,
          unidadeProduto,
          ingredientes
        );
      }
    } else {
      finalizarCadastro(
        nomeProduto,
        pesoVolumeProduto,
        unidadeProduto,
        ingredientes
      );
    }
  }

  adicionarIngredientePrompt();
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
      item.innerText = `${ingrediente.nome} - ${ingrediente.quantidadeUsada} ${
        ingrediente.unidadeUsada
      } (Custo: R$ ${(
        (ingrediente.preco / ingrediente.pesoVolumeTotal) *
        ingrediente.quantidadeUsada
      ).toFixed(2)})`;
      listaIngredientes.appendChild(item);
    });
    produtoDiv.appendChild(listaIngredientes);

    const custoTotal = document.createElement("p");
    custoTotal.innerText = `Custo Total: R$ ${produto.custoTotal.toFixed(2)}`;
    produtoDiv.appendChild(custoTotal);

    pai.appendChild(produtoDiv);
  });
}
