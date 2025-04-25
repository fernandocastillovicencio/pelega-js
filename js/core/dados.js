import { GRUPO_Z, GRUPO_M, GRUPO_A, PESOS } from './constantes.js';

export function carregarBase(callback) {
  const baseJogadores = {};

  Papa.parse('data/jogadores.csv', {
    download: true,
    header: true,
    complete: function (results) {
      results.data.forEach(jog => {
        if (jog.id) {
          baseJogadores[jog.id.trim().toLowerCase()] = jog;
        }
      });
      callback(baseJogadores);
    }
  });
}

export function calcularMG(jogador) {
  return parseFloat((
    (parseFloat(jogador.Físico)     || 3) * PESOS.Físico +
    (parseFloat(jogador.Velocidade) || 3) * PESOS.Velocidade +
    (parseFloat(jogador.Defesa)     || 3) * PESOS.Defesa +
    (parseFloat(jogador.Ataque)     || 3) * PESOS.Ataque +
    (parseFloat(jogador.Tática)     || 3) * PESOS.Tática +
    (parseFloat(jogador.Técnica)    || 3) * PESOS.Técnica
  ).toFixed(2));
}

export function posicaoTatica(jogador) {
  const pos = (jogador.Pos1 || '').toUpperCase().trim();
  if (GRUPO_Z.includes(pos)) return 'Z';
  if (GRUPO_M.includes(pos)) return 'M';
  if (GRUPO_A.includes(pos)) return 'A';
  return 'M';
}

export function extrairNomes(texto) {
  const linhas = texto.split('\n');
  let capturando = false;
  const nomes = [];

  for (let linha of linhas) {
    linha = linha.trim();

    if (linha.includes('AVULSOS')) {
      capturando = true;
      continue;
    }

    if (linha.includes('GOLEIROS')) {
      capturando = false;
      continue;
    }

    if (linha.includes('MENSALISTAS')) {
      capturando = true;
      continue;
    }

    if (capturando && linha.match(/^\d+\-/)) {
      let nomeOriginal = linha.replace(/^\d+\-/, '').split('+')[0].trim();
      let nomeInterno = nomeOriginal
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
      if (nomeInterno) nomes.push(nomeInterno);
    }
  }

  return nomes;
}
