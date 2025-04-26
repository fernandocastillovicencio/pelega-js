// parseJogos.js
// Arquivo responsável por carregar e processar os dados dos jogos a partir de um arquivo de texto.

/**
 * Carrega os dados dos jogos de um arquivo de texto (`data/jogos.txt`), processa-os
 * e retorna um array de objetos de jogo. Cada objeto de jogo contém informações
 * sobre os times (nome, jogadores, gols por jogador) e o placar final.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve com um array contendo os dados dos jogos processados.
 */
export async function carregarJogos() {
  // Faz a requisição para buscar o arquivo de texto com os dados dos jogos.
  const response = await fetch("data/jogos.txt");
  // Aguarda a resposta e lê o conteúdo do arquivo como texto.
  const texto = await response.text();

  // Divide o texto completo em blocos de jogo individuais.
  // A separação é feita pela string "data:", que parece marcar o início de cada registro de jogo.
  // `map(b => b.trim())` remove espaços em branco do início e fim de cada bloco.
  // `filter(b => b)` remove quaisquer blocos que ficaram vazios após o trim (ex: se houver "data:" no final do arquivo).
  const blocos = texto
    .split("data:") // Divide o texto onde encontrar "data:"
    .map((b) => b.trim()) // Remove espaços em branco do início e fim de cada bloco
    .filter((b) => b); // Remove blocos que ficaram vazios após o trim

  // Inicializa um array vazio que armazenará os objetos de jogo processados.
  const jogos = [];

  // Itera sobre cada bloco de texto que representa um jogo.
  for (let bloco of blocos) {
    // Inicia um bloco try-catch para lidar com possíveis erros durante o processamento de um único jogo.
    // Isso garante que, se um bloco estiver mal formatado, o processamento dos outros blocos continue.
    try {
      // Divide o bloco atual em linhas individuais, baseado na quebra de linha (`\n`).
      // `map(l => l.trim())` remove espaços em branco do início e fim de cada linha.
      // `filter(l => l)` remove quaisquer linhas que ficaram vazias após o trim.
      const linhas = bloco
        .split("\n") // Divide o bloco em linhas baseado na quebra de linha
        .map((l) => l.trim()) // Remove espaços das pontas de cada linha
        .filter((l) => l); // Remove linhas que ficaram vazias

      // Inicializa estruturas de dados para os dois times do jogo atual.
      // Cada time terá um nome e uma lista de jogadores (com seus gols na partida).
      let time1 = { nome: "", jogadores: [] };
      let time2 = { nome: "", jogadores: [] };
      // Variável de estado para saber qual seção do bloco está sendo lida no momento
      // (null, 'time1' ou 'time2'). Isso controla onde adicionar os jogadores encontrados.
      let capturando = null;

      // Itera sobre cada linha dentro do bloco do jogo atual.
      for (let linha of linhas) {
        // Verifica se a linha indica o início dos dados do Time 1 (começa com "# Time 1").
        if (linha.startsWith("# Time 1")) {
          // Extrai o nome do Time 1, removendo o prefixo "# Time 1 -",
          // removendo espaços extras (`trim()`) e convertendo para minúsculas para padronização.
          time1.nome = linha.replace("# Time 1 -", "").trim().toLowerCase();
          // Define o estado 'capturando' para indicar que as próximas linhas (até "# Time 2" ou "jogos:")
          // pertencem aos jogadores do Time 1.
          capturando = "time1";
          // Pula para a próxima iteração do loop de linhas, pois esta linha já foi processada.
          continue;
        }

        // Verifica se a linha indica o início dos dados do Time 2 (começa com "# Time 2").
        if (linha.startsWith("# Time 2")) {
          // Extrai o nome do Time 2, similar ao Time 1.
          time2.nome = linha.replace("# Time 2 -", "").trim().toLowerCase();
          // Define o estado 'capturando' para indicar que as próximas linhas (até "jogos:")
          // pertencem aos jogadores do Time 2.
          capturando = "time2";
          // Pula para a próxima iteração do loop de linhas.
          continue;
        }

        // Verifica se a linha contém o resultado final do jogo (começa com "jogos:").
        if (linha.startsWith("jogos:")) {
          // Remove o prefixo "jogos:" e espaços extras da linha do resultado.
          const resultadoLinha = linha.replace("jogos:", "").trim();
          // Usa uma expressão regular para extrair os nomes dos times e os gols do placar.
          // Exemplo de formato esperado: "NomeTimeA 2 - NomeTimeB 1"
          // Regex:
          // (\w+)     - Captura o nome do time 1 (uma ou mais letras/números/\_)
          // \s+       - Um ou mais espaços
          // (\d+)     - Captura os gols do time 1 (um ou mais dígitos)
          // \s*-\s*   - Hífen opcionalmente cercado por espaços
          // (\w+)     - Captura o nome do time 2
          // \s+       - Um ou mais espaços
          // (\d+)     - Captura os gols do time 2
          // /i        - Case-insensitive (ignora maiúsculas/minúsculas nos nomes dos times)
          const match = resultadoLinha.match(
            /(\w+)\s+(\d+)\s*-\s*(\w+)\s+(\d+)/i
          );

          // Se a regex encontrou um padrão correspondente na linha do resultado...
          if (match) {
            // Desestrutura o resultado da regex para obter os nomes e gols capturados.
            // O primeiro elemento (`_`) é a string completa correspondente, que ignoramos.
            const [_, nomeTime1, gols1, nomeTime2, gols2] = match;
            // Adiciona o objeto do jogo completo ao array 'jogos'.
            jogos.push({
              time1, // Objeto do time 1 (com nome e jogadores já capturados)
              time2, // Objeto do time 2 (com nome e jogadores já capturados)
              placar: {
                // Cria um objeto para o placar, usando os nomes dos times em minúsculas como chaves
                // e os gols convertidos para inteiros (`parseInt`) como valores.
                [nomeTime1.toLowerCase()]: parseInt(gols1),
                [nomeTime2.toLowerCase()]: parseInt(gols2),
              },
            });
          }
          // Como o resultado foi encontrado, assume-se que este é o fim das informações
          // relevantes deste bloco de jogo. Encerra o loop interno (processamento das linhas).
          break;
        }

        // Se a linha não for um cabeçalho de time ou o resultado, e estivermos
        // dentro de uma seção de time (`capturando` não é null)...
        if (capturando === "time1" || capturando === "time2") {
          // Tenta extrair o nome do jogador e, opcionalmente, seus gols na partida.
          // Exemplo de formato esperado: "NomeJogador" ou "NomeJogador (3)" ou "NomeJogador (-1)"
          // Regex:
          // ^(...)     - Começo da linha
          // ([\wçáéíóúãõâêîôûàèìòùäëïöü'-]+) - Captura o nome do jogador (letras, números, _, ç, acentos, ', -)
          // (\s*\((-?\d+)\))? - Grupo opcional para os gols:
          //   \s*\(    - Espaços opcionais seguidos de parêntese de abertura
          //   (-?\d+)  - Captura um número (opcionalmente negativo, um ou mais dígitos) - ESTE É O GRUPO 3 (gols)
          //   \)       - Parêntese de fechamento
          // $         - Fim da linha
          // /i        - Case-insensitive
          const regex = /^([\wçáéíóúãõâêîôûàèìòùäëïöü'-]+)(\s*\((-?\d+)\))?$/i;
          const match = linha.match(regex); // Tenta aplicar a regex na linha atual.

          // Se a regex encontrou um padrão correspondente (linha de jogador válida)...
          if (match) {
            // Extrai o nome do jogador (grupo 1 da regex).
            // Normaliza o nome para um formato de ID consistente:
            const nome = match[1]
              .normalize("NFD") // Normaliza para decompor acentos (ex: 'á' vira 'a' + '´')
              .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos, cedilha, etc.)
              .toLowerCase(); // Converte para minúsculas.
            // Extrai os gols (grupo 3 da regex).
            // Se o grupo 3 foi capturado (match[3] não é undefined), converte para inteiro.
            // Caso contrário (jogador sem gols especificados na linha), define como 0.
            // Permite gols negativos (ex: gols contra).
            const gols = match[3] ? parseInt(match[3]) : 0;

            // Adiciona o jogador (com id normalizado e gols) ao array de jogadores do time correto,
            // baseado no valor atual da variável de estado 'capturando'.
            if (capturando === "time1") {
              time1.jogadores.push({ id: nome, gols });
            } else {
              // Se não for time1, só pode ser time2 (devido à condição anterior)
              time2.jogadores.push({ id: nome, gols });
            }
          }
          // Se a linha não corresponder à regex de jogador, ela é simplesmente ignorada
          // (pode ser uma linha em branco extra, um comentário não padrão, etc.).
        }
      } // Fim do loop de linhas do bloco
    } catch (erro) {
      // Captura e exibe um erro caso ocorra alguma exceção durante o processamento do bloco atual.
      // Inclui o conteúdo do bloco problemático e o objeto de erro no log para facilitar a depuração.
      console.error("❌ Erro ao processar bloco de jogo:", bloco, erro);
    }
  } // Fim do loop de blocos

  // Exibe uma mensagem de sucesso e o array 'jogos' resultante no console (útil para depuração).
  console.log("✅ Jogos carregados:", jogos);
  // Retorna o array 'jogos' contendo todos os dados dos jogos processados com sucesso.
  return jogos;
}
