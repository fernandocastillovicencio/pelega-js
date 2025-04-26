// renderTabelas.js
import { formatarNumero } from "./utils.js";

export function renderizarTabelas(stats) {
  const jogadores = Object.values(stats);

  // Prepara dados para tabelas
  const dadosPontos = jogadores.map((j) => ({
    imagem: gerarImagemHTML(j.imagem, j.nome),
    nome: j.nome,
    pj: j.jogos > 0 ? (j.pontos / j.jogos).toFixed(2) : 0,
    pontos: j.pontos,
    jogos: j.jogos,
    vitorias: j.vitorias,
    empates: j.empates,
    derrotas: j.derrotas,
  }));

  const dadosGols = jogadores.map((j) => ({
    imagem: gerarImagemHTML(j.imagem, j.nome),
    nome: j.nome,
    gj: j.jogos > 0 ? (j.gols / j.jogos).toFixed(2) : 0,
    gols: j.gols,
    jogos: j.jogos,
  }));

  const dadosDefesa = jogadores.map((j) => ({
    imagem: gerarImagemHTML(j.imagem, j.nome),
    gcj: j.jogos > 0 ? (j.golsContra / j.jogos).toFixed(2) : 0,
    nome: j.nome,
    golsContra: j.golsContra,
    jogos: j.jogos,
  }));

  criarTabela("#tabela-pontos", dadosPontos, colunasPontos());
  criarTabela("#tabela-gols", dadosGols, colunasGols());
  criarTabela("#tabela-defesa", dadosDefesa, colunasDefesa());
}

function criarTabela(seletor, dados, colunas) {
  new Tabulator(seletor, {
    data: dados,
    layout: "fitColumns",
    responsiveLayout: "collapse",
    pagination: false, // 🔥 sem paginação
    columns: colunas,
    height: "auto", // 🔥 altura automática
  });
}

function gerarImagemHTML(imagem, nome) {
  return `
        <img src="assets/jogadores/${imagem}" alt="${nome}"
             style="width:40px; height:40px; border-radius:50%; object-fit:cover;"
             onerror="this.onerror=null;this.src='assets/jogadores/dummy.png';">
    `;
}

function colunasPontos() {
  return [
    {
      title: "Foto",
      field: "imagem",
      formatter: "html",
      formatterParams: { allowHtml: true },
      hozAlign: "center",
      headerSort: false,
      width: 80,
    },
    { title: "Jogador", field: "nome", headerFilter: "input" },
    { title: "P/J", field: "pj", sorter: "number" },
    { title: "Pontos", field: "pontos", sorter: "number" },
    { title: "Jogos", field: "jogos", sorter: "number" },
    { title: "Vitórias", field: "vitorias", sorter: "number" },
    { title: "Empates", field: "empates", sorter: "number" },
    { title: "Derrotas", field: "derrotas", sorter: "number" },
  ];
}

function colunasGols() {
  return [
    {
      title: "Foto",
      field: "imagem",
      formatter: "html",
      formatterParams: { allowHtml: true },
      hozAlign: "center",
      headerSort: false,
      width: 80,
    },
    { title: "Jogador", field: "nome", headerFilter: "input" },
    { title: "G/J", field: "gj", sorter: "number" },
    { title: "Gols", field: "gols", sorter: "number" },
    { title: "Jogos", field: "jogos", sorter: "number" },
  ];
}

function colunasDefesa() {
  return [
    {
      title: "Foto",
      field: "imagem",
      formatter: "html",
      formatterParams: { allowHtml: true },
      hozAlign: "center",
      headerSort: false,
      width: 80,
    },
    { title: "Jogador", field: "nome", headerFilter: "input" },
    { title: "GC/J", field: "gcj", sorter: "number" },
    { title: "Gols Contra", field: "golsContra", sorter: "number" },
    { title: "Jogos", field: "jogos", sorter: "number" },
  ];
}
