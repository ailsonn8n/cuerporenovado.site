const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function enviarMensagem() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Exibe a mensagem do usuário na tela
    adicionarMensagem(texto, 'user-message');
    userInput.value = '';

    // Simula o tempo de digitação do consultor
    const idCarregando = adicionarMensagem('Analisando o mercado...', 'ai-message');

    setTimeout(() => {
        const respostaIA = gerarRespostaInteligente(texto);
        atualizarMensagem(idCarregando, respostaIA);
    }, 1000); // Responde em 1 segundo
}

function gerarRespostaInteligente(pergunta) {
    const p = pergunta.toLowerCase();

    if (p.includes('fii') || p.includes('fundo imobiliario') || p.includes('fundos imobiliários')) {
        return "Os Fundos Imobiliários (FIIs) são a base mais eficiente para geração de renda passiva mensal isenta de Imposto de Renda. O foco deve ser em ativos de tijolo com boa localização ou de papel com garantias sólidas (CRIs), sempre visando o reinvestimento dos dividendos para acelerar o efeito bola de neve.";
    } 
    else if (p.includes('juros') || p.includes('compostos') || p.includes('bola de neve')) {
        return "O efeito bola de neve dos juros compostos nos FIIs ocorre quando o rendimento mensal (dividendos) é integralmente utilizado para comprar novas cotas. No longo prazo, a quantidade de cotas gera proventos que compram ainda mais cotas, criando um ciclo de crescimento exponencial do patrimônio sem aporte adicional.";
    } 
    else if (p.includes('alavancaj') || p.includes('emprestimo') || p.includes('imovel')) {
        return "A alavancagem imobiliária consiste em utilizar capital de terceiros (como financiamentos estruturados ou crédito com garantia) a taxas inferiores ao dividend yield ou à valorização do ativo. Se bem calculada, o próprio fluxo de caixa gerado pelo imóvel ou fundo paga a dívida, acelerando a construção de patrimônio.";
    } 
    else if (p.includes('olá') || p.includes('ola') || p.includes('bom dia') || p.includes('boa tarde')) {
        return "Olá! Sou seu consultor financeiro especialista em FIIs, estratégias de longo prazo e alavancagem. O que vamos analisar hoje?";
    } 
    else {
        return "Análise registrada. Para mantermos o foco na nossa estratégia, recomendo avaliarmos o impacto disso no reinvestimento de dividendos dos FIIs ou em cenários de alavancagem. Deseja simular uma projeção de juros compostos?";
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
