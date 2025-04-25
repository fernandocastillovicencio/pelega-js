import {
  carregarBase,
  calcularMG,
  posicaoTatica,
  extrairNomes,
} from './core/dados.js';

import {
  selecionarCapitaes,
  escolherTimesAlternado,
} from './core/equilibrio.js';

import {
  renderListaConfirmados,
  preencherSelectFixos,
  renderCapitaes,
  renderTimes,
} from './ui/render.js';

let baseJogadores = {};
let jogadoresConfirmados = [];

document.addEventListener('DOMContentLoaded', () => {
  // Usa o ID específico do botão para vinculação do evento.
  document
    .getElementById('btnProcessar')
    .addEventListener('click', processarLista);
});

function processarLista() {
  console.log('✅ Botão clicado! processarLista() acionado.');

  const texto = document.getElementById('inputLista').value;
  // Debug: confira o texto colado
  console.log('Texto do textarea:', texto);

  const nomesExtraidos = extrairNomes(texto);
  console.log('Nomes extraídos:', nomesExtraidos);

  if (nomesExtraidos.length === 0) {
    console.warn('Nenhum nome extraído. Verifique a formatação da lista.');
    return;
  }

  carregarBase((base) => {
    baseJogadores = base;
    console.log('✅ Jogadores carregados (IDs):', Object.keys(baseJogadores));

    jogadoresConfirmados = [];
    nomesExtraidos.forEach((id) => {
      let jogador = baseJogadores[id];
      if (!jogador) {
        console.warn(
          `Jogador "${id}" não encontrado na base. Usando valores padrão.`
        );
        jogador = {
          id: id,
          Nome: id,
          Defesa: 3,
          Físico: 3,
          Tática: 3,
          Velocidade: 3,
          Técnica: 3,
          Ataque: 3,
        };
      }
      jogadoresConfirmados.push({
        id: id,
        nome: jogador.Nome,
        mg: calcularMG(jogador),
        pos: posicaoTatica(jogador),
        ...jogador,
      });
    });

    console.log(
      '✅ Jogadores confirmados:',
      jogadoresConfirmados.map((j) => j.nome)
    );

    // Renderiza a lista de jogadores identificados e preenche os selects
    renderListaConfirmados(jogadoresConfirmados);
    preencherSelectFixos(jogadoresConfirmados);

    // Detecta jogadores fixos (caso o usuário os selecione manualmente)
    const idFixo1 = document.getElementById('fixo1').value;
    const idFixo2 = document.getElementById('fixo2').value;

    let capitaoA, capitaoB;
    let timeAfixoExtra = null;
    let listaParaSortear = jogadoresConfirmados;

    if (idFixo1 && idFixo2 && idFixo1 !== idFixo2) {
      const jogador1 = jogadoresConfirmados.find((j) => j.id === idFixo1);
      const jogador2 = jogadoresConfirmados.find((j) => j.id === idFixo2);
      if (jogador1 && jogador2) {
        console.log(
          `✅ Jogadores fixos selecionados: ${jogador1.nome} e ${jogador2.nome}`
        );
        capitaoA = jogador1;
        timeAfixoExtra = jogador2;
        listaParaSortear = jogadoresConfirmados.filter(
          (j) => j.id !== idFixo1 && j.id !== idFixo2
        );
        capitaoB = null; // Não haverá capitão B se os dois forem fixados no Time A
      }
    } else {
      const capit = selecionarCapitaes(jogadoresConfirmados);
      capitaoA = capit.capitaoA;
      capitaoB = capit.capitaoB;
      console.log(
        `✅ Capitães sorteados: ${capitaoA?.nome} e ${capitaoB?.nome}`
      );
    }

    // Limpa renderizações anteriores (exceto a estrutura principal)
    document
      .getElementById('app')
      .querySelectorAll('div, h3')
      .forEach((el) => {
        if (!el.closest('nav') && el.id !== 'listaConfirmados') el.remove();
      });

    renderCapitaes(capitaoA, capitaoB);

    const { timeA, timeB } = escolherTimesAlternado(
      listaParaSortear,
      capitaoA,
      capitaoB,
      timeAfixoExtra
    );

    renderTimes(timeA, timeB);
  });
}
