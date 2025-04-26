import { organizarPorPosicao, mediaTime } from '../core/equilibrio.js';

function limparRenderizacao() {
  const app = document.getElementById('app');
  const nodosExtras = [...app.querySelectorAll('div, h3')].filter(
    (el) => !el.closest('nav') && !el.querySelector('#listaConfirmados')
  );
  nodosExtras.forEach((el) => el.remove());
}

export function renderListaConfirmados(
  lista,
  containerId = 'listaConfirmados'
) {
  const ul = document.getElementById(containerId);
  ul.innerHTML = '';
  lista.forEach((jogador) => {
    const li = document.createElement('li');
    li.textContent = jogador.nome;
    ul.appendChild(li);
  });
}

export function preencherSelectFixos(lista) {
  const select1 = document.getElementById('fixo1');
  const select2 = document.getElementById('fixo2');

  [select1, select2].forEach((sel) => {
    sel.innerHTML = '<option value="">-- nenhum --</option>';
    lista.forEach((jogador) => {
      const opt = document.createElement('option');
      opt.value = jogador.id;
      opt.textContent = jogador.nome;
      sel.appendChild(opt);
    });
  });
}

export function renderCapitaes(capitaoA, capitaoB) {
  limparRenderizacao(); // limpa antes de desenhar
  const div = document.createElement('div');
  div.innerHTML = `
    <h3>Capitães Selecionados:</h3>
    <p><strong>Capitão A:</strong> ${capitaoA.nome} (mg: ${capitaoA.mg}, pos: ${
    capitaoA.pos
  })</p>
    ${
      capitaoB
        ? `<p><strong>Capitão B:</strong> ${capitaoB.nome} (mg: ${capitaoB.mg}, pos: ${capitaoB.pos})</p>`
        : ''
    }
  `;
  document.getElementById('app').appendChild(div);
}
/* -------------------------------------------------------------------------- */
/*                                RENDER TIMES                                */
/* -------------------------------------------------------------------------- */
import { organizarPorPosicao } from '../core/equilibrio.js';

export function renderTimes(timeA, timeB) {
  const organizadoA = organizarPorPosicao(timeA);
  const organizadoB = organizarPorPosicao(timeB);

  const box = document.createElement('div');
  box.id = 'times-box';
  box.innerHTML = `
    <h3>Time A <span style="color: red;">(vermelho)</span></h3>
    <p><strong>ZAG:</strong> | ${organizadoA.Z.map((j) => j.nome).join(
      ' | '
    )} |</p>
    <p><strong>MEI:</strong> | ${organizadoA.M.map((j) => j.nome).join(
      ' | '
    )} |</p>
    <p><strong>ATA:</strong> | ${organizadoA.A.map((j) => j.nome).join(
      ' | '
    )} |</p>

    <h3>Time B <span style="color: blue;">(azul)</span></h3>
    <p><strong>ZAG:</strong> | ${organizadoB.Z.map((j) => j.nome).join(
      ' | '
    )} |</p>
    <p><strong>MEI:</strong> | ${organizadoB.M.map((j) => j.nome).join(
      ' | '
    )} |</p>
    <p><strong>ATA:</strong> | ${organizadoB.A.map((j) => j.nome).join(
      ' | '
    )} |</p>
  `;
  document.getElementById('app').appendChild(box);
}
