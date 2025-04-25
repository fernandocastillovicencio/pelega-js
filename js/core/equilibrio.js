export function selecionarCapitaes(lista) {
  if (lista.length < 2) return { capitaoA: null, capitaoB: null };

  const embaralhados = [...lista].sort(() => Math.random() - 0.5);

  for (let i = 0; i < embaralhados.length; i++) {
    const cap1 = embaralhados[i];
    const mesmaPos = embaralhados.filter(
      (j) => j.id !== cap1.id && j.pos === cap1.pos
    );

    if (mesmaPos.length > 0) {
      const cap2 = mesmaPos[Math.floor(Math.random() * mesmaPos.length)];
      return { capitaoA: cap1, capitaoB: cap2 };
    }
  }

  return { capitaoA: embaralhados[0], capitaoB: embaralhados[1] };
}
export function mediaTime(lista) {
  const soma = lista.reduce((acc, j) => acc + (parseFloat(j.mg) || 3), 0);
  return (soma / lista.length).toFixed(2);
}

export function organizarPorPosicao(lista) {
  return {
    Z: lista.filter((j) => j.pos === 'Z'),
    M: lista.filter((j) => j.pos === 'M'),
    A: lista.filter((j) => j.pos === 'A'),
  };
}

export function escolherTimesAlternado(
  lista,
  capitaoA,
  capitaoB,
  fixoA = null
) {
  const timeA = [capitaoA];
  if (fixoA) timeA.push(fixoA);
  const timeB = capitaoB ? [capitaoB] : [];

  const idsFixos = [capitaoA.id];
  if (capitaoB) idsFixos.push(capitaoB.id);
  if (fixoA) idsFixos.push(fixoA.id);

  const restantes = lista.filter((j) => !idsFixos.includes(j.id));

  const contagem = (time) => ({
    Z: time.filter((j) => j.pos === 'Z').length,
    M: time.filter((j) => j.pos === 'M').length,
    A: time.filter((j) => j.pos === 'A').length,
  });

  let turno = 'B';

  while (restantes.length > 0) {
    const timeAtual = turno === 'A' ? timeA : timeB;
    const outroTime = turno === 'A' ? timeB : timeA;

    const contAtual = contagem(timeAtual);
    const mediaAtual = mediaTime(timeAtual);
    const mediaOutro = mediaTime(outroTime);
    const mediaDesejada = (parseFloat(mediaAtual) + parseFloat(mediaOutro)) / 2;

    const posicoes = ['Z', 'M', 'A'];
    const faltando = posicoes.sort((a, b) => contAtual[a] - contAtual[b]);
    const posDesejada = faltando[0];

    let candidatos = restantes.filter((j) => j.pos === posDesejada);
    if (candidatos.length === 0) candidatos = [...restantes];

    candidatos.sort(
      (a, b) =>
        Math.abs(
          (mediaAtual * timeAtual.length + a.mg) / (timeAtual.length + 1) -
            mediaDesejada
        ) -
        Math.abs(
          (mediaAtual * timeAtual.length + b.mg) / (timeAtual.length + 1) -
            mediaDesejada
        )
    );

    const escolhido = candidatos[0];
    timeAtual.push(escolhido);
    restantes.splice(restantes.indexOf(escolhido), 1);

    turno = turno === 'A' ? 'B' : 'A';
  }

  return { timeA, timeB };
}
/* --------------------------- SELECIONAR CAPITAES -------------------------- */
export function selecionarCapitaes(lista) {
  if (lista.length < 2) return { capitaoA: null, capitaoB: null };

  const porPosicao = {};

  lista.forEach((jogador) => {
    if (!porPosicao[jogador.pos]) porPosicao[jogador.pos] = [];
    porPosicao[jogador.pos].push(jogador);
  });

  const posicoesDisponiveis = Object.keys(porPosicao).filter(
    (pos) => porPosicao[pos].length >= 2
  );

  if (posicoesDisponiveis.length === 0) {
    // fallback: qualquer dois jogadores
    const [capitaoA, capitaoB] = lista.slice(0, 2);
    return { capitaoA, capitaoB };
  }

  // Escolher posição aleatória entre as possíveis
  const posEscolhida =
    posicoesDisponiveis[Math.floor(Math.random() * posicoesDisponiveis.length)];
  const candidatos = porPosicao[posEscolhida];

  // Ordenar os candidatos dessa posição pela média ponderada (mg)
  candidatos.sort((a, b) => a.mg - b.mg);

  // Encontrar o par de jogadores mais próximos em mg
  let menorDiferenca = Infinity;
  let parSelecionado = [candidatos[0], candidatos[1]];

  for (let i = 0; i < candidatos.length - 1; i++) {
    const diff = Math.abs(candidatos[i].mg - candidatos[i + 1].mg);
    if (diff < menorDiferenca) {
      menorDiferenca = diff;
      parSelecionado = [candidatos[i], candidatos[i + 1]];
    }
  }

  return { capitaoA: parSelecionado[0], capitaoB: parSelecionado[1] };
}
