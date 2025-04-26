// main.js
// Arquivo principal que orquestra o carregamento de dados, cálculo de estatísticas e renderização na página.

// Importa as funções necessárias de outros módulos.
// Cada módulo tem uma responsabilidade específica:
import { carregarBaseJogadores } from "./baseJogadores.js"; // Carrega dados dos jogadores (do CSV).
import { carregarJogos } from "./parseJogos.js"; // Carrega e processa dados dos jogos (do TXT).
import { calcularEstatisticas } from "./calcularEstatisticas.js"; // Calcula as estatísticas com base nos jogadores e jogos.
import { renderizarTabelas } from "./renderTabelas.js"; // Renderiza as tabelas de estatísticas na página.
import { renderizarDestaques } from "./renderDestaques.js"; // Renderiza os cards de destaque (melhor jogador, etc.).

// Adiciona um ouvinte de evento ao botão com o ID "btnProcessar".
// Quando o botão for clicado, a função assíncrona definida abaixo será executada.
document.getElementById("btnProcessar").addEventListener("click", async () => {
  // O uso de 'async' aqui permite que usemos 'await' dentro da função,
  // o que é necessário para esperar que as operações de carregamento de dados (fetch) terminem.

  // Inicia um bloco try...catch para lidar com possíveis erros durante o processamento.
  // Se qualquer uma das etapas dentro do 'try' falhar, o controle passará para o bloco 'catch'.
  try {
    // Exibe uma mensagem no console indicando o início do processamento.
    console.log("🔵 Processando dados...");

    // 1. Carrega a base de dados dos jogadores.
    // Chama a função 'carregarBaseJogadores' e espera (await) sua conclusão.
    // O resultado (um objeto com os dados dos jogadores) é armazenado na constante 'baseJogadores'.
    const baseJogadores = await carregarBaseJogadores();

    // 2. Carrega o histórico de jogos.
    // Chama a função 'carregarJogos' e espera (await) sua conclusão.
    // O resultado (um array de objetos de jogo) é armazenado na constante 'jogos'.
    const jogos = await carregarJogos();

    // 3. Calcula as estatísticas.
    // Chama a função 'calcularEstatisticas', passando os dados carregados ('jogos' e 'baseJogadores').
    // Esta função é síncrona (não precisa de await) pois apenas processa dados já em memória.
    // O resultado (um objeto com as estatísticas calculadas por jogador) é armazenado na constante 'estatisticas'.
    const estatisticas = calcularEstatisticas(jogos, baseJogadores);

    // 4. Renderiza os destaques na página.
    // Chama a função 'renderizarDestaques', passando as estatísticas calculadas.
    // Esta função atualizará os elementos HTML correspondentes aos destaques (ex: artilheiro).
    renderizarDestaques(estatisticas);

    // 5. Renderiza as tabelas de estatísticas na página.
    // Chama a função 'renderizarTabelas', passando as estatísticas calculadas.
    // Esta função usará a biblioteca Tabulator (ou similar) para criar/atualizar as tabelas na interface.
    renderizarTabelas(estatisticas);

    // Exibe uma mensagem no console indicando que o processamento foi concluído com sucesso.
    console.log("✅ Processamento concluído.");

    // Fim do bloco 'try'.
  } catch (erro) {
    // Se ocorrer qualquer erro no bloco 'try', este bloco 'catch' será executado.
    // Exibe uma mensagem de erro detalhada no console, incluindo o objeto de erro.
    // Isso ajuda na depuração para identificar onde e por que o processo falhou.
    console.error("❌ Erro ao processar:", erro);
  }
}); // Fim do ouvinte de evento 'click'.
