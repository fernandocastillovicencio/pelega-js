// Dados dos jogadores e jogos
const jogadores = [
    { nome: "rafael", gols: 3, vitorias: 2, empates: 1, derrotas: 0 },
    { nome: "joarez", gols: 1, vitorias: 1, empates: 2, derrotas: 0 },
    { nome: "jhonny", gols: 5, vitorias: 3, empates: 0, derrotas: 1 },
    { nome: "pedrow", gols: 2, vitorias: 2, empates: 1, derrotas: 1 },
    { nome: "julianor", gols: 1, vitorias: 1, empates: 2, derrotas: 1 },
    { nome: "tiago", gols: 0, vitorias: 0, empates: 3, derrotas: 1 },
];

// Função para calcular os pontos do jogador
function calcularPontos(jogador) {
    return jogador.vitorias * 3 + jogador.empates;
}

// Função para gerar a tabela de ranking
function gerarTabelaRanking() {
    const tabelaBody = document.querySelector("#ranking-table tbody");

    // Ordena os jogadores por pontos
    jogadores.sort((a, b) => calcularPontos(b) - calcularPontos(a));

    // Para cada jogador, cria uma linha na tabela
    jogadores.forEach(jogador => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${jogador.nome}</td>
            <td>${jogador.gols}</td>
            <td>${calcularPontos(jogador)}</td>
            <td>${jogador.vitorias}</td>
            <td>${jogador.empates}</td>
            <td>${jogador.derrotas}</td>
        `;
        
        tabelaBody.appendChild(row);
    });
}

// Função para mostrar a aba selecionada
function showTab(tabName) {
    // Oculta todas as abas
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => tab.style.display = "none");

    // Remove a classe de destaque das abas
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => button.classList.remove("active"));

    // Exibe a aba selecionada
    document.getElementById(tabName).style.display = "block";

    // Destaca o botão da aba selecionada
    document.getElementById(tabName + "-tab").classList.add("active");
}

// Chama a função de exibição da aba de ranking ao carregar
window.onload = () => {
    showTab('ranking');
    gerarTabelaRanking();
};
