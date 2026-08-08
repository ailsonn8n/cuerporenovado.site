const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
let historico = [];

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user-message');
    userInput.value = '';

    const idCarregando = adicionarMensagem('Analisando o mercado...', 'ai-message');

    try {
        const resp = await fetch('https://cuerporenovado-site.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem: texto, historico })
        });
        const data = await resp.json();

        atualizarMensagem(idCarregando, data.resposta);

        historico.push({ role: 'user', content: texto });
        historico.push({ role: 'assistant', content: data.resposta });
    } catch (err) {
        atualizarMensagem(idCarregando, 'Erro ao conectar com a IA. Tente novamente.');
    }
}

function adicionarMensagem(texto, classeCSS) {
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = `message ${classeCSS}`;
    div.textContent = texto;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function atualizarMensagem(id, texto) {
    const div = document.getElementById(id);
    if (div) {
        div.innerHTML = texto.replace(/\n/g, "<br>");
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem();
    }
});
