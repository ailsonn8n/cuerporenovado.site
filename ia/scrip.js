// Substitua o texto abaixo pela sua chave do Google AI Studio
const API_KEY = "AQ.Ab8RN6Ioxc6Ssxx4eCvJ55ppNPN8G6JzV-HFexg_w9xo5xnOog"; 

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Esta é a personalidade e o conhecimento base da sua IA
const systemInstruction = "Você é um consultor financeiro especialista e racional. Seu foco principal é analisar estratégias de geração de renda passiva através de Fundos Imobiliários (FIIs), explicar o efeito bola de neve dos juros compostos no longo prazo e avaliar cenários de alavancagem imobiliária. Responda de forma direta e sem jargões desnecessários.";

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Adiciona a pergunta do usuário na tela
    adicionarMensagem(texto, 'user-message');
    userInput.value = '';

    // Adiciona a mensagem de "Pensando..."
    const idCarregando = adicionarMensagem('Analisando o mercado...', 'ai-message');

    try {
        // Envia a requisição para o cérebro do Gemini
        const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: texto }] }]
            })
        });

        const dados = await resposta.json();
        
        // Extrai o texto da resposta da IA
        const textoRespostaIA = dados.candidates[0].content.parts[0].text;
        
        // Atualiza a mensagem de "Pensando..." com a resposta final
        atualizarMensagem(idCarregando, textoRespostaIA);
        
    } catch (erro) {
        atualizarMensagem(idCarregando, 'Erro na comunicação. Verifique sua API Key ou sua conexão.');
        console.error(erro);
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
        div.textContent = texto;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Permite enviar a mensagem apertando "Enter"
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem();
    }
});
