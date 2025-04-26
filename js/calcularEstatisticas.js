// calcularEstatisticas.js
// Arquivo responsável por calcular as estatísticas individuais dos jogadores
// com base nos resultados dos jogos e na base de dados de jogadores.

/**
 * Calcula as estatísticas individuais de cada jogador com base nos jogos fornecidos.
 * @param {Array<Object>} jogos - Array de objetos de jogo, cada um contendo informações dos times e placar. (Gerado por parseJogos.js)
 * @param {Object} baseJogadores - Objeto onde as chaves são IDs de jogadores e os valores são objetos com dados dos jogadores. (Gerado por baseJogadores.js)
 * @returns {Object} Um objeto onde as chaves são IDs de jogadores e os valores são objetos contendo as estatísticas calculadas (jogos, vitórias, gols, etc.).
 */
export function calcularEstatisticas(jogos, baseJogadores) {
  // Inicializa um objeto vazio que armazenará as estatísticas de cada jogador.
  // A chave será o ID do jogador e o valor será um objeto com suas estatísticas.
  const stats = {};

  // Inicializa a estrutura de estatísticas para todos os jogadores presentes na base de dados.
  // Isso garante que mesmo jogadores que não participaram de nenhum jogo registrado
  // apareçam na lista final de estatísticas com valores zerados.
  for (let id in baseJogadores) {
    // Para cada ID de jogador na base de dados...
    stats[id] = {
      // Cria uma entrada no objeto 'stats' usando o ID do jogador como chave.
      id: id, // Armazena o ID do jogador.
      nome: baseJogadores[id].nome, // Copia o nome do jogador da base de dados.
      imagem: baseJogadores[id].imagem, // Copia o caminho da imagem do jogador.
      // Inicializa todas as estatísticas numéricas com 0.
      jogos: 0, // Número de jogos disputados.
      vitorias: 0, // Número de vitórias.
      empates: 0, // Número de empates.
      derrotas: 0, // Número de derrotas.
      pontos: 0, // Pontos ganhos (Vitória=3, Empate=1, Derrota=0).
      gols: 0, // Gols marcados pelo jogador.
      golsContra: 0, // Gols contra marcados pelo jogador.
    };
  }

  // Itera sobre cada objeto de jogo no array 'jogos'.
  jogos.forEach((jogo) => {
    // Desestrutura o objeto 'jogo' para obter facilmente os dados dos times e o placar.
    const { time1, time2, placar } = jogo;

    // Obtém os gols de cada time do objeto 'placar'.
    // Usa o nome do time em minúsculas como chave (conforme definido em parseJogos.js).
    // Usa o operador nullish coalescing (??) para definir 0 caso o time não esteja no placar (segurança extra).
    const golsTime1 = placar[time1.nome.toLowerCase()] ?? 0;
    const golsTime2 = placar[time2.nome.toLowerCase()] ?? 0;

    // Variáveis para armazenar o resultado do jogo para cada time ('vitoria', 'derrota', 'empate').
    let resultadoTime1, resultadoTime2;

    // Determina o resultado da partida comparando os gols.
    if (golsTime1 > golsTime2) {
      // Time 1 venceu.
      resultadoTime1 = "vitoria";
      resultadoTime2 = "derrota";
    } else if (golsTime1 < golsTime2) {
      // Time 2 venceu.
      resultadoTime1 = "derrota";
      resultadoTime2 = "vitoria";
    } else {
      // Empate.
      resultadoTime1 = "empate";
      resultadoTime2 = "empate";
    }

    // Chama a função auxiliar para atualizar as estatísticas dos jogadores de cada time,
    // passando o objeto do time, o resultado da partida para aquele time,
    // o objeto principal de estatísticas e a base de jogadores (embora não usada diretamente na função auxiliar).
    atualizarStats(time1, resultadoTime1, stats, baseJogadores);
    atualizarStats(time2, resultadoTime2, stats, baseJogadores);
  }); // Fim do loop de jogos

  // Exibe as estatísticas calculadas no console (útil para depuração).
  console.log("✅ Estatísticas calculadas:", stats);
  // Retorna o objeto 'stats' completo.
  return stats;
}

/**
 * Função auxiliar para atualizar as estatísticas de todos os jogadores de um time específico
 * com base no resultado de um jogo.
 * @param {Object} time - Objeto do time contendo nome e array de jogadores ({id, gols}).
 * @param {string} resultado - O resultado do jogo para este time ('vitoria', 'derrota', 'empate').
 * @param {Object} stats - O objeto principal de estatísticas que será modificado.
 * @param {Object} baseJogadores - A base de dados de jogadores (atualmente não utilizada diretamente nesta função, mas passada como parâmetro para consistência ou uso futuro).
 */
function atualizarStats(time, resultado, stats, baseJogadores) {
  // Itera sobre cada jogador listado no array 'jogadores' do time.
  // Cada 'jogador' aqui é um objeto { id: 'nome_normalizado', gols: numero_gols_partida }.
  time.jogadores.forEach((jogador) => {
    // Obtém o ID normalizado do jogador (conforme definido em parseJogos.js).
    const id = jogador.id;

    // Verifica se o jogador existe na base de estatísticas (que foi inicializada com baseJogadores).
    // Se um jogador listado no arquivo de jogos não estiver na base de dados (jogadores.csv),
    // ele será ignorado e um aviso será exibido.
    if (!stats[id]) {
      // Exibe um aviso no console informando que o jogador foi ignorado.
      console.warn(`⚠️ Jogador "${id}" não está cadastrado e foi ignorado.`);
      // Pula para a próxima iteração do loop de jogadores (não processa este jogador).
      return;
    }

    // Incrementa o número de jogos disputados pelo jogador.
    stats[id].jogos += 1;
    // Adiciona os gols marcados pelo jogador na partida às suas estatísticas totais.
    // Verifica se 'jogador.gols' é positivo. Se for, adiciona o valor. Se for 0 ou negativo (gol contra), adiciona 0.
    stats[id].gols += jogador.gols > 0 ? jogador.gols : 0;
    // Adiciona os gols contra marcados pelo jogador na partida às suas estatísticas totais.
    // Verifica se 'jogador.gols' é negativo. Se for, pega o valor absoluto (positivo) e adiciona. Caso contrário, adiciona 0.
    stats[id].golsContra += jogador.gols < 0 ? Math.abs(jogador.gols) : 0;

    // Atualiza vitórias, empates, derrotas e pontos com base no resultado da partida para o time deste jogador.
    if (resultado === "vitoria") {
      stats[id].vitorias += 1; // Incrementa o contador de vitórias.
      stats[id].pontos += 3; // Adiciona 3 pontos por vitória.
    } else if (resultado === "empate") {
      stats[id].empates += 1; // Incrementa o contador de empates.
      stats[id].pontos += 1; // Adiciona 1 ponto por empate.
    } else if (resultado === "derrota") {
      stats[id].derrotas += 1; // Incrementa o contador de derrotas.
      // Nenhum ponto é adicionado por derrota (stats[id].pontos += 0), então não há linha para isso.
    }
  }); // Fim do loop de jogadores do time
}
