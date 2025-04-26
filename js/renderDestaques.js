// renderDestaques.js
export function renderizarDestaques(stats) {
  const jogadores = Object.values(stats);

  // Calcula os melhores para cada categoria
  const topGoleadores = encontrarTop(jogadores, (j) => j.gols, "desc");
  const topAproveitamento = encontrarTop(
    jogadores,
    (j) => (j.jogos > 0 ? j.pontos / j.jogos : 0),
    "desc"
  );
  const topDefesa = encontrarTop(
    jogadores,
    (j) => (j.jogos > 0 ? j.golsContra / j.jogos : Infinity),
    "asc"
  );

  // Renderiza os destaques
  desenharDestaque(
    "maiorGoleador",
    "🏆 Maior Goleador",
    topGoleadores,
    (j) => `${j.gols} gols`
  );
  desenharDestaque(
    "melhorAproveitamento",
    "🏆 Melhor Aproveitamento",
    topAproveitamento,
    (j) => `${(j.pontos / j.jogos).toFixed(2)} pontos/jogo`
  );
  desenharDestaque(
    "melhorDefesa",
    "🛡️ Melhor Defesa",
    topDefesa,
    (j) => `${(j.golsContra / j.jogos).toFixed(2)} gols sofridos/jogo`
  );
}

function encontrarTop(lista, criterio, ordem = "desc") {
  const sorted = [...lista].sort((a, b) => {
    const diff = criterio(b) - criterio(a);
    return ordem === "desc" ? diff : -diff;
  });

  const melhores = [];
  let referencia = criterio(sorted[0]);

  for (let jogador of sorted) {
    if (melhores.length < 3 && criterio(jogador) === referencia) {
      melhores.push(jogador);
    } else if (melhores.length >= 3) {
      break;
    }
  }

  return melhores;
}

function desenharDestaque(containerId, titulo, jogadores, formatarEstatistica) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<h3>${titulo}</h3>`;

  jogadores.forEach((j) => {
    const div = document.createElement("div");
    div.style.margin = "10px 0";

    div.innerHTML = `
            <img src="assets/jogadores/${j.imagem}" alt="${j.nome}" 
                 style="width:80px; height:80px; border-radius:50%; object-fit:cover;"
                 onerror="this.onerror=null;this.src='assets/jogadores/dummy.png';">
            <h4 style="margin:5px 0; font-size:24px;">${j.nome}</h4>
            <p style="margin:0; font-size:18px; color:#ccc;">${formatarEstatistica(
              j
            )}</p>
        `;

    container.appendChild(div);
  });
}
