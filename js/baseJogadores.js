// baseJogadores.js (VERSÃO FINAL)
// Arquivo responsável por carregar e processar os dados dos jogadores a partir de um arquivo CSV.

/**
 * Carrega os dados dos jogadores de um arquivo CSV, processa-os e retorna um objeto
 * onde cada chave é o ID normalizado do jogador e o valor é um objeto com os dados do jogador.
 * @returns {Promise<Object>} Uma promessa que resolve com um objeto contendo os dados dos jogadores.
 */
export async function carregarBaseJogadores() {
  // Faz a requisição para buscar o arquivo CSV com os dados dos jogadores.
  const response = await fetch("data/jogadores.csv");
  // Aguarda a resposta e lê o conteúdo do arquivo como texto.
  const texto = await response.text();

  // Remove espaços em branco extras do início e fim do texto e divide o texto em um array de linhas.
  const linhas = texto.trim().split("\n");
  // Remove a primeira linha (cabeçalho) do array 'linhas' e a divide em um array de nomes de colunas (campos), usando a vírgula como delimitador.
  const cabecalho = linhas.shift().split(",");

  // Inicializa um objeto vazio que armazenará os dados dos jogadores, usando o ID do jogador como chave.
  const jogadores = {};

  // Itera sobre cada linha restante no array 'linhas' (cada linha representa um jogador).
  linhas.forEach((linha) => {
    // Divide a linha atual em um array de valores de campo, usando a vírgula como delimitador.
    const campos = linha.split(",");

    // Cria um objeto temporário para armazenar os dados brutos do jogador lidos do CSV.
    const jogador = {};
    // Itera sobre os nomes das colunas no cabeçalho.
    cabecalho.forEach((campo, index) => {
      // Para cada coluna, adiciona uma propriedade ao objeto 'jogador'.
      // A chave é o nome da coluna (removendo espaços extras das pontas).
      // O valor é o campo correspondente da linha atual (removendo espaços extras das pontas),
      // ou uma string vazia se o campo não existir (usando optional chaining '?').
      jogador[campo.trim()] = campos[index]?.trim() || "";
    });

    // Processa o ID do jogador para criar uma chave única e padronizada:
    const id = jogador.id // Obtém o valor do campo 'id' do jogador temporário.
      ?.toLowerCase() // Converte o ID para minúsculas.
      .normalize("NFD") // Normaliza a string para decompor caracteres acentuados (ex: 'á' vira 'a' + ´).
      .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos (acentos, cedilha, etc.) usando uma expressão regular.

    // Verifica se um ID válido foi extraído (evita processar linhas vazias ou mal formatadas).
    if (id) {
      // Adiciona o jogador ao objeto 'jogadores', usando o ID processado como chave.
      // Cria um objeto estruturado com os dados do jogador, tratando tipos e valores padrão.
      jogadores[id] = {
        id: id, // Armazena o ID processado.
        nome: jogador.Nome || id, // Define o nome do jogador, usando o valor do campo 'Nome' ou o próprio ID como fallback.
        pos1: jogador.Pos1 || "", // Define a posição primária (Pos1), ou string vazia se não houver.
        pos2: jogador.Pos2 || "", // Define a posição secundária (Pos2), ou string vazia se não houver.
        // Converte os atributos numéricos para float, usando 0 como valor padrão se a conversão falhar ou o campo estiver vazio.
        defesa: parseFloat(jogador.Defesa) || 0,
        fisico: parseFloat(jogador["Físico"]) || 0, // Usa notação de colchetes para acessar chave com caractere especial.
        tatica: parseFloat(jogador.Tática) || 0,
        velocidade: parseFloat(jogador.Velocidade) || 0,
        tecnica: parseFloat(jogador.Técnica) || 0,
        ataque: parseFloat(jogador.Ataque) || 0,
        resposta: parseFloat(jogador.Resposta) || 0,
        parceria: parseFloat(jogador.Parceria) || 0,
        // Define o caminho da imagem, usando o valor do campo 'imagem' se existir,
        // ou construindo um caminho padrão baseado no ID processado.
        imagem: jogador.imagem || `assets/jogadores/${id}.png`,
      };
    }
  });

  // Exibe uma mensagem de sucesso e o objeto 'jogadores' resultante no console (útil para depuração).
  console.log("✅ Jogadores carregados:", jogadores);
  // Retorna o objeto 'jogadores' contendo todos os dados processados.
  return jogadores;
}
