// O sistema vai buscar a chave no "cofre" do seu navegador
let API_KEY = localStorage.getItem("minha_api_key_gemini");

// Se não tiver chave salva, ele vai abrir um alerta pedindo
if (!API_KEY) {
    API_KEY = prompt("Bem-vindo! Para começar, cole sua API Key do Google AI Studio aqui:\n(Ela ficará salva apenas no seu navegador, com segurança)");
    if (API_KEY) {
        localStorage.setItem("minha_api_key_gemini", API_KEY.trim());
    }
}

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

const systemInstruction = "Você é um consultor financeiro especialista e racional. Seu foco principal é analisar estratégias de geração de renda passiva através de Fundos Imobiliários (FIIs), explicar o efeito bola de neve dos juros compostos no longo prazo e avaliar cenários de alavancagem imobiliária. Responda de forma direta e sem jargões desnecessários.";

async function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    if (!API_KEY) {
        adicionarMensagem("Erro: Nenhuma API Key encontrada. Recarregue a página e insira sua chave para testar.", 'ai-message');
        return;
    }

    adicionarMensagem(texto, 'user-message');
    userInput.value = '';

    const idCarregando = adicionarMensagem('Analisando o mercado...', 'ai-message');

    try {
        // Link atualizado com a etiqueta correta exigida pelo Google: gemini-1.5-flash-latest
        const resposta = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: texto }] }]
            })
        });

        const dados = await resposta.json();
        
        // Tratamento de segurança para caso a chave esteja errada, bloqueada ou o modelo falhe
        if (dados.error) {
            atualizarMensagem(idCarregando, `Erro de API: ${dados.error.message}`);
            if (dados.error.code === 401 || dados.error.code === 400 || dados.error.code === 403) {
                // Se a chave for inválida ou o robô bloquear, ele apaga do cofre para você colocar outra na próxima vez
                localStorage.removeItem("minha_api_key_gemini");
                API_KEY = null; 
            }
            return;
        }
        
        const textoRespostaIA = dados.candidates[0].content.parts[0].text;
        atualizarMensagem(idCarregando, textoRespostaIA);
        
    } catch (erro) {
        atualizarMensagem(idCarregando, 'Erro na comunicação. Verifique sua conexão com a internet ou se a API Key é válida.');
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
        // Transforma quebras de linha padrão do texto em quebras visuais no HTML
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
