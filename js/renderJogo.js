// renderJogo.js

async function carregarJogos() {
  try {
    const response = await fetch("data/jogos.txt");
    const texto = await response.text();

    // Separar os jogos pelo separador
    const blocos = texto
      .split(
        "# ---------------------------------------------------------------------------- #"
      )
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    console.log("🛒 Jogos carregados:", blocos);

    return blocos;
  } catch (erro) {
    console.error("Erro ao carregar jogos.txt:", erro);
    return [];
  }
}

function parseJogo(bloco) {
  const linhas = bloco
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let data = "";
  let times = [];
  let placar = null;
  let timeAtual = null;
  let jogadores = [];

  for (let linha of linhas) {
    if (linha.startsWith("data:")) {
      data = linha.replace("data:", "").trim();
    } else if (linha.startsWith("# Time")) {
      if (timeAtual) {
        times.push({
          nome: timeAtual,
          jogadores: jogadores,
        });
      }
      timeAtual = linha.replace("# Time", "").split("-")[1].trim();
      jogadores = [];
    } else if (linha === "---") {
      // separador, ignorar
    } else if (linha.startsWith("placar:")) {
      const resultado = linhas
        .slice(linhas.indexOf(linha) + 1)
        .join(" ")
        .toLowerCase();
      const match = resultado.match(/(\w+)\s+(\d+)\s*-\s*(\w+)\s+(\d+)/);
      if (match) {
        placar = {
          time1: match[1],
          gols1: parseInt(match[2]),
          time2: match[3],
          gols2: parseInt(match[4]),
        };
      }
      break; // depois do placar, não tem mais nada
    } else {
      jogadores.push(linha);
    }
  }

  // adicionar último time lido
  if (timeAtual) {
    times.push({
      nome: timeAtual,
      jogadores: jogadores,
    });
  }

  return { data, times, placar };
}

async function iniciar() {
  const blocos = await carregarJogos();
  const jogos = blocos.map(parseJogo);

  console.log("✅ Jogos interpretados:", jogos);

  // Só desenhar o primeiro jogo por enquanto
  if (jogos.length > 0) {
    renderizarJogo(jogos[0]);
  }
}

iniciar();

function renderizarJogo(jogo) {
  const container = document.getElementById("lista-jogos");

  const jogoDiv = document.createElement("div");
  jogoDiv.className = "jogo";

  // 🏆 Placar
  const placarHTML = `
  <div class="placar">
    <div class="time">
      <span class="emoji-time">${timeEmoji(jogo.placar.time1)}</span>
      <span class="nome-time" style="color:${timeCor(jogo.placar.time1)}">${
    jogo.placar.time1
  }</span>
      <span class="gols">${jogo.placar.gols1}</span>
    </div>
    <div class="separador">x</div>
    <div class="time">
    <span class="emoji-time">${timeEmoji(jogo.placar.time2)}</span>
    <span class="nome-time" style="color:${timeCor(jogo.placar.time2)}">${
    jogo.placar.time2
  }</span>
    <span class="gols">${jogo.placar.gols2}</span>
    </div>
  </div>
`;

  const goleadoresHTML = gerarGoleadores(jogo);

  // 🏟️ Campo com jogadores
  const campoHTML = `
  <div class="campos-times">
    <div class="campo">
      ${gerarJogadoresPorTime(jogo.times[0])}
    </div>
    <div class="campo">
      ${gerarJogadoresPorTime(jogo.times[1])}
    </div>
  </div>
`;

  jogoDiv.innerHTML = `
  <h2>${jogo.data}</h2>
  ${placarHTML}
  ${goleadoresHTML}
  ${campoHTML}
`;

  container.appendChild(jogoDiv);
}
// =============================================================================
// jogadores por time
// =============================================================================
function gerarJogadoresPorTime(time) {
  const jogadores = time.jogadores;

  const coresPastelEscuras = {
    vermelho: "#E53935",
    azul: "#1565C0",
    verde: "#388E3C",
    amarelo: "#FBC02D",
  };

  const timeCor = time.nome.toLowerCase();
  const corDeFundo = coresPastelEscuras[timeCor] || "#C0C0C0";

  let linhas = [];

  for (let i = 0; i < jogadores.length; i += 3) {
    const linhaJogadores = jogadores
      .slice(i, i + 3)
      .map((jogador) => {
        const nomeLimpo = extrairNomeJogador(jogador);
        return `<div class="jogador" style="background-color: ${corDeFundo}">${nomeLimpo}</div>`;
      })
      .join("");
    linhas.push(`<div class="linha-jogadores">${linhaJogadores}</div>`);
  }

  return linhas.join("");
}
// =============================================================================
// extrair nome do jogador
// =============================================================================
function extrairNomeJogador(texto) {
  const match = texto.match(/^([^\(]+)\s*(\(([^)]+)\))?$/);
  if (match) {
    return match[1].trim(); // Pega o nome antes dos parênteses
  }
  return texto.trim();
}
// =============================================================================
// gerar goleadores
// =============================================================================
function gerarGoleadores(jogo) {
  const time1 = jogo.times[0];
  const time2 = jogo.times[1];

  const golsTime1 = time1.jogadores
    .map((jogador) => extrairNomeEGols(jogador))
    .filter((jg) => jg.gols > 0)
    .map((jg) => `<div>${jg.nome} ${"⚽".repeat(jg.gols)}</div>`)
    .join("");

  const golsTime2 = time2.jogadores
    .map((jogador) => extrairNomeEGols(jogador))
    .filter((jg) => jg.gols > 0)
    .map((jg) => `<div>${jg.nome} ${"⚽".repeat(jg.gols)}</div>`)
    .join("");

  return `
    <div class="goleadores">
      <div class="goleadores-time">
        ${golsTime1 || "<div>Sem gols</div>"}
      </div>
      <div class="goleadores-time">
        ${golsTime2 || "<div>Sem gols</div>"}
      </div>
    </div>
  `;
}

// =============================================================================
// extrair nome gols
// =============================================================================
function extrairNomeEGols(texto) {
  const match = texto.match(/^([^\(]+)\s*(\(([^)]+)\))?$/);
  if (match) {
    const nome = match[1].trim();
    const gols = match[3] ? parseInt(match[3]) : 0;
    return { nome, gols };
  }
  return { nome: texto.trim(), gols: 0 };
}

function timeEmoji(nomeTime) {
  const nome = nomeTime.toLowerCase();
  if (nome.includes("vermelho")) return "🔴";
  if (nome.includes("azul")) return "🔵";
  return "⚪"; // default
}

function timeCor(nomeTime) {
  const nome = nomeTime.toLowerCase();
  if (nome.includes("vermelho")) return "#E53935";
  if (nome.includes("azul")) return "#1565C0";
  return "#333";
}
