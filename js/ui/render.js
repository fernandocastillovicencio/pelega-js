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

export function renderTimes(timeA, timeB) {
  const organizadoA = organizarPorPosicao(timeA);
  const organizadoB = organizarPorPosicao(timeB);

  const mediaA = mediaTime(timeA);
  const mediaB = mediaTime(timeB);

  const box = document.createElement('div');
  box.innerHTML = `
    <h3>Times Montados:</h3>
    <div style="display: flex; gap: 40px; justify-content: center;">
      <div>
        <h4>Time A</h4>
        <strong>Zagueiros:</strong>
        <ul>${organizadoA.Z.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <strong>Meias:</strong>
        <ul>${organizadoA.M.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <strong>Atacantes:</strong>
        <ul>${organizadoA.A.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <p><strong>Média do Time A:</strong> ${mediaA}</p>
      </div>
      <div>
        <h4>Time B</h4>
        <strong>Zagueiros:</strong>
        <ul>${organizadoB.Z.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <strong>Meias:</strong>
        <ul>${organizadoB.M.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <strong>Atacantes:</strong>
        <ul>${organizadoB.A.map((j) => `<li>${j.nome}</li>`).join('')}</ul>
        <p><strong>Média do Time B:</strong> ${mediaB}</p>
      </div>
    </div>
  `;
  document.getElementById('app').appendChild(box);
}
