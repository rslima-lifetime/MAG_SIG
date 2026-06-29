/**
 * SIG² - Assistente de Gente e Gestão (AI Agent Component)
 * Fornece um chat inteligente rodando totalmente local no navegador,
 * com capacidade de consultar dados de líderes, equipes, indicadores e alertas.
 */

// Helper to normalize strings for comparison (remove accents, casing, extra whitespace)
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '') // remove punctuation
    .trim();
}

/**
 * Intelligent client-side query processor
 * Reads the current dashboard state to build natural language responses
 */
function processAIQuery(query, state) {
  const normQuery = normalizeText(query);
  const currentLeader = state.leaders.find(l => l.id === state.selectedLeaderId) || state.leaders[0];
  
  // 1. Find if the query mentions a specific leader
  let targetLeader = currentLeader;
  let leaderMentioned = false;
  
  for (const leader of state.leaders) {
    const leaderNormName = normalizeText(leader.nome);
    const firstName = normalizeText(leader.nome.split(' ')[0]);
    
    // Check for full name or first name match (be careful with "joao" matches since we have two Joãos)
    if (normQuery.includes(leaderNormName)) {
      targetLeader = leader;
      leaderMentioned = true;
      break;
    }
  }
  
  // If not full name, search first name. Since we have João Silva and João Ribeiro, resolve ambiguity.
  if (!leaderMentioned) {
    if (normQuery.includes('joao silva') || (normQuery.includes('silva') && normQuery.includes('joao'))) {
      targetLeader = state.leaders.find(l => l.id === 'joao-silva');
      leaderMentioned = true;
    } else if (normQuery.includes('joao ribeiro') || (normQuery.includes('ribeiro') && normQuery.includes('joao'))) {
      targetLeader = state.leaders.find(l => l.id === 'joao-ribeiro');
      leaderMentioned = true;
    } else {
      // General checks for other leaders
      for (const leader of state.leaders) {
        const firstName = normalizeText(leader.nome.split(' ')[0]);
        if (normQuery.includes(firstName) && firstName.length > 3) {
          targetLeader = leader;
          leaderMentioned = true;
          break;
        }
      }
    }
  }

  const leaderName = targetLeader.nome;
  const leaderId = targetLeader.id;
  const teamInfo = state.team[leaderId] || {};
  const leaderAlerts = state.alerts.filter(a => a.leaderId === leaderId) || [];
  const leaderJourney = state.journey.leaders[leaderId] || { timeline: [], conquistas: [] };

  // Helper formatting functions
  const markdownBold = (str) => `**${str}**`;

  // INTENT: HELP / ACTIONS
  if (normQuery.includes('ajuda') || normQuery.includes('o que voce faz') || normQuery.includes('como funciona') || normQuery.includes('instrucoes') || normQuery.includes('ajude') || normQuery.includes('help')) {
    return `Olá! Eu sou o **Assistente de Gente (SIG²)**. Posso responder perguntas sobre o banco de dados de liderança da MAG.

Aqui estão alguns exemplos do que você pode me perguntar:
• **Sobre um líder**: *"Quem é João Silva?"* ou *"Qual o cargo da Ana Souza?"*
• **Sobre métricas de equipe**: *"Qual o turnover do Carlos Lima?"* ou *"Qual o headcount do João Ribeiro?"*
• **Sobre alertas/riscos**: *"Quais os alertas da Ana Souza?"* ou *"Existe alguma pendência crítica?"*
• **Comparações**: *"Quem tem o maior score?"* ou *"Quem tem mais liderados?"*

Como deseja começar?`;
  }

  // INTENT: ALERTS & RISKS
  if (normQuery.includes('alerta') || normQuery.includes('risco') || normQuery.includes('critico') || normQuery.includes('problema') || normQuery.includes('pendencia') || normQuery.includes('atencao')) {
    const listAlerts = (leaderObj, alertsArr) => {
      if (alertsArr.length === 0) {
        return `Não há alertas ativos ou pendências críticas mapeadas para a equipe de **${leaderObj.nome}** no momento. Tudo está em conformidade!`;
      }
      let resp = `Encontrei **${alertsArr.length} alerta(s)** para **${leaderObj.nome}** (Área: ${leaderObj.area}):\n\n`;
      alertsArr.forEach((al, idx) => {
        const severityEmoji = al.severity === 'Crítico' ? '🔴' : al.severity === 'Prioridade' ? '🟡' : '🔵';
        resp += `${idx + 1}. ${severityEmoji} **[${al.severity}] ${al.title}**\n   • *Descrição:* ${al.description}\n   • *Ação Sugerida:* ${al.suggestedAction}\n\n`;
      });
      return resp;
    };

    if (leaderMentioned) {
      return listAlerts(targetLeader, leaderAlerts);
    } else {
      // General alerts question or current leader
      if (normQuery.includes('todos') || normQuery.includes('geral') || normQuery.includes('sistema')) {
        let resp = `**Alertas Ativos em todo o Painel de Liderança:**\n\n`;
        let total = 0;
        state.leaders.forEach(l => {
          const lAlerts = state.alerts.filter(a => a.leaderId === l.id);
          if (lAlerts.length > 0) {
            resp += `👤 **${l.nome}** (${l.cargo}):\n`;
            lAlerts.forEach(al => {
              const severityEmoji = al.severity === 'Crítico' ? '🔴' : al.severity === 'Prioridade' ? '🟡' : '🔵';
              resp += `  - ${severityEmoji} [${al.severity}] ${al.title}\n`;
              total++;
            });
            resp += `\n`;
          }
        });
        if (total === 0) return `Não há alertas de risco ativos no sistema atualmente.`;
        return resp;
      }
      return `Como você não especificou outro líder, aqui estão os alertas para **${targetLeader.nome}** (líder atualmente ativo no painel):\n\n` + listAlerts(targetLeader, leaderAlerts);
    }
  }

  // INTENT: COMPARISONS (BEST SCORES, HIGHEST TURNOVER, HEADCOUNT)
  if (normQuery.includes('quem tem') || normQuery.includes('maior') || normQuery.includes('melhor') || normQuery.includes('pior') || normQuery.includes('comparar') || normQuery.includes('mais')) {
    // Highest Score
    if (normQuery.includes('score') || normQuery.includes('nota') || normQuery.includes('pontuacao')) {
      const sorted = [...state.leaders].sort((a, b) => b.scoreGeral - a.scoreGeral);
      let resp = `**Ranking de Líderes por Score Geral (Gente & Gestão):**\n\n`;
      sorted.forEach((l, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '•';
        resp += `${medal} **${l.nome}**: Score ${l.scoreGeral}/100 (${l.cargo} - ${l.area})\n`;
      });
      return resp;
    }
    // Highest Turnover
    if (normQuery.includes('turnover') || normQuery.includes('rotatividade') || normQuery.includes('saida')) {
      const getTurnoverVal = (lId) => parseFloat((state.team[lId]?.turnover || '0%').replace('%', '').replace(',', '.'));
      const sorted = [...state.leaders].sort((a, b) => getTurnoverVal(b.id) - getTurnoverVal(lId));
      let resp = `**Taxa de Turnover (Rotatividade de Equipe):**\n\n`;
      sorted.forEach((l, idx) => {
        const value = state.team[l.id]?.turnover || '0%';
        const warning = getTurnoverVal(l.id) >= 12 ? '⚠️ (Alto)' : '';
        resp += `• **${l.nome}**: ${value} ${warning} (${l.pessoasLideradas} liderados)\n`;
      });
      return resp;
    }
    // Most reports (Headcount)
    if (normQuery.includes('headcount') || normQuery.includes('equipe') || normQuery.includes('tamanho') || normQuery.includes('liderados') || normQuery.includes('pessoas')) {
      const sorted = [...state.leaders].sort((a, b) => b.pessoasLideradas - a.pessoasLideradas);
      let resp = `**Tamanho das Equipes Lideradas (Headcount):**\n\n`;
      sorted.forEach((l, idx) => {
        const medal = idx === 0 ? '👑' : '•';
        resp += `${medal} **${l.nome}**: ${l.pessoasLideradas} liderados (${l.area})\n`;
      });
      return resp;
    }
  }

  // INTENT: TURNOVER SPECIFIC
  if (normQuery.includes('turnover') || normQuery.includes('rotatividade')) {
    const turnVal = teamInfo.turnover || 'N/A';
    return `O turnover acumulado do time liderado por **${leaderName}** é de **${turnVal}**.\n\n` +
           `*Referência do mercado/grupo:* Menor que 10% é considerado saudável. ` +
           (parseFloat(turnVal.replace('%', '')) >= 12 ? `A equipe está atualmente acima da linha de alerta crítica (12%).` : `O indicador está dentro do limite aceitável.`);
  }

  // INTENT: ABSENTEEISM SPECIFIC
  if (normQuery.includes('absenteismo') || normQuery.includes('falta')) {
    const absVal = teamInfo.absenteismo || 'N/A';
    return `A taxa de absenteísmo (ausências e faltas) na equipe de **${leaderName}** é de **${absVal}**.\n\n` +
           `A média corporativa de referência é de até 3,0%.`;
  }

  // INTENT: HEADCOUNT SPECIFIC
  if (normQuery.includes('headcount') || normQuery.includes('liderados') || normQuery.includes('tamanho da equipe') || normQuery.includes('quantas pessoas') || normQuery.includes('membros')) {
    return `A equipe sob liderança direta e indireta de **${leaderName}** possui **${targetLeader.pessoasLideradas} colaboradores** ativos no momento.`;
  }

  // INTENT: COLLABORATORS-CHAVE
  if (normQuery.includes('colaboradores chave') || normQuery.includes('talento') || normQuery.includes('chave') || normQuery.includes('essenciais')) {
    const chave = teamInfo.colaboradoresChave || 0;
    const retencao = teamInfo.retencaoTalentos || 'N/A';
    return `Na equipe de **${leaderName}**, existem **${chave} colaboradores-chave** mapeados como essenciais ou talentos críticos.\n\n` +
           `A taxa de retenção desses talentos-chave é de **${retencao}**.`;
  }

  // INTENT: SUCCESSORS
  if (normQuery.includes('sucessor') || normQuery.includes('sucessores') || normQuery.includes('sucessao')) {
    const suc = teamInfo.sucessores || 0;
    return `Para a cadeira de **${leaderName}** (${targetLeader.cargo}), temos **${suc} sucessor(es)** imediatos/prontos mapeados no Ciclo de Gente corporativo.`;
  }

  // INTENT: CLIMATE/GPTW
  if (normQuery.includes('clima') || normQuery.includes('gptw') || normQuery.includes('pesquisa de clima')) {
    const clima = teamInfo.climaTime || 'N/A';
    return `A nota de clima do time liderado por **${leaderName}** é **${clima}** na pesquisa mais recente.`;
  }

  // INTENT: VACATION & TIMECARD
  if (normQuery.includes('ferias') || normQuery.includes('ponto') || normQuery.includes('cartao de ponto')) {
    const ponto = teamInfo.gestaoPonto || 'N/A';
    const ferias = teamInfo.aprovacaoFerias || 'N/A';
    const pendencias = teamInfo.pendenciasGestao || 0;
    return `**Indicadores de Gestão Administrativa para ${leaderName}:**\n\n` +
           `• **Conformidade de Ponto:** ${ponto}\n` +
           `• **Programação/Aprovação de Férias:** ${ferias}\n` +
           `• **Pendências de Gestão Pendentes:** ${pendencias} item(ns) pendente(s).`;
  }

  // INTENT: INDIVIDUAL METRICS / SCORES FOR A LEADER
  if (normQuery.includes('score') || normQuery.includes('nota') || normQuery.includes('pontuacao') || normQuery.includes('desempenho') || normQuery.includes('indicadores')) {
    const sc = targetLeader.scoresPorDimensao || {};
    return `**Pontuação de Desempenho (Scores) de ${leaderName}:**\n` +
           `• **Score Geral (Saúde da Equipe):** ${targetLeader.scoreGeral}/100\n\n` +
           `**Detalhamento por Dimensão:**\n` +
           `• 📈 **Resultado:** ${sc.Resultado !== null ? sc.Resultado + '/100' : 'N/A'}\n` +
           `• 👥 **Gestão de Pessoas:** ${sc.Gestao !== null ? sc.Gestao + '/100' : 'N/A'}\n` +
           `• 🎓 **Desenvolvimento:** ${sc.Desenvolvimento !== null ? sc.Desenvolvimento + '/100' : 'N/A'}\n` +
           `• 🌟 **Cultura:** ${sc.Cultura !== null ? sc.Cultura + '/100' : 'N/A'}\n` +
           `• 🛡️ **Risco & Compliance:** ${sc.Risco !== null ? sc.Risco + '/100' : 'N/A'}`;
  }

  // INTENT: GENERAL RESUME / BIO OF A LEADER (Who is...?)
  if (normQuery.includes('quem e') || normQuery.includes('resumo') || normQuery.includes('detalhes') || normQuery.includes('informacoes') || normQuery.includes('bio') || leaderMentioned) {
    const sc = targetLeader.scoresPorDimensao || {};
    return `**Ficha Executiva de ${leaderName}:**\n\n` +
           `• **Cargo:** ${targetLeader.cargo}\n` +
           `• **Área/Diretoria:** ${targetLeader.area} / ${targetLeader.diretoria}\n` +
           `• **Tempo de Empresa:** ${targetLeader.tempoEmpresa}\n` +
           `• **Tempo na Função:** ${targetLeader.tempoFuncao}\n` +
           `• **Liderados Diretos/Indiretos:** ${targetLeader.pessoasLideradas} pessoas\n` +
           `• **Reporta para:** ${targetLeader.reportaPara}\n` +
           `• **Última Movimentação:** ${targetLeader.ultimaPromocao}\n` +
           `• **Mapeamento de Potencial:** ${targetLeader.potencial} (${targetLeader.potencialSigla}) - ${targetLeader.prontidao}\n` +
           `• **Score de Liderança Geral:** ${targetLeader.scoreGeral}/100\n` +
           `• **Alertas de Risco:** ${leaderAlerts.length} ativo(s).`;
  }

  // DEFAULT FALLBACK
  return `Não entendi completamente sua dúvida sobre "${query}".\n\n` +
         `Posso ajudar com informações de líderes, equipes, turnover, absenteísmo, notas de clima (GPTW) e alertas de conformidade.\n\n` +
         `*Dica:* Tente digitar o nome de um líder específico (Ex: "João Silva", "Ana Souza" ou "Carlos Lima") junto com a métrica desejada.`;
}

/**
 * Parses dynamic markdown-like text to HTML
 */
function parseMarkdown(text) {
  if (!text) return '';
  return text
    // Paragraph lists
    .split('\n')
    .map(line => {
      let l = line.trim();
      if (l.startsWith('•') || l.startsWith('-')) {
        return `<li class="ml-4 list-disc mb-1">${parseBold(l.substring(1).trim())}</li>`;
      }
      if (/^\d+\./.test(l)) {
        const match = l.match(/^(\d+)\.(.*)/);
        if (match) {
          return `<li class="ml-4 list-decimal mb-1 font-medium">${parseBold(match[2].trim())}</li>`;
        }
      }
      return l ? `<p class="mb-2">${parseBold(l)}</p>` : '<div class="h-2"></div>';
    })
    .join('');
}

function parseBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
}

/**
 * ChatAgent Class and initialization
 */
export function initChatAgent(state, onSelectLeader) {
  // Ensure we don't render multiple times
  if (document.getElementById('chat-agent-fab')) return;

  // Add floating button (FAB)
  const fab = document.createElement('button');
  fab.id = 'chat-agent-fab';
  fab.className = 'fixed bottom-6 right-6 z-50 bg-mag-dark text-white rounded-full p-4 shadow-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center cursor-pointer border border-slate-700/50 group focus:outline-none print-hide';
  fab.innerHTML = `
    <div class="relative">
      <i data-lucide="message-square" class="w-6 h-6"></i>
      <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-mag-dark animate-pulse"></span>
    </div>
  `;
  document.body.appendChild(fab);

  // Add chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-agent-window';
  chatWindow.className = 'fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 transform scale-95 opacity-0 pointer-events-none print-hide';
  chatWindow.innerHTML = `
    <!-- Header -->
    <div class="bg-mag-dark text-white p-4 flex items-center justify-between border-b border-slate-700/50">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-md relative">
          <i data-lucide="bot" class="w-5 h-5"></i>
          <span class="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-mag-dark"></span>
        </div>
        <div>
          <h3 class="font-semibold text-sm leading-tight text-slate-100">Assistente SIG²</h3>
          <span class="text-xs text-emerald-400 font-medium flex items-center">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Online
          </span>
        </div>
      </div>
      <button id="chat-agent-close" class="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition focus:outline-none">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Messages Container -->
    <div id="chat-agent-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
      <!-- Welcome message -->
    </div>

    <!-- Suggested Questions Chips -->
    <div class="p-2 border-t border-slate-100 bg-white/80 shrink-0">
      <div class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 mb-1">Perguntas Frequentes:</div>
      <div id="chat-agent-suggestions" class="flex flex-wrap gap-1.5 px-1 py-1 max-h-[85px] overflow-y-auto">
        <!-- Will be loaded dynamically based on active leader -->
      </div>
    </div>

    <!-- Input Form -->
    <form id="chat-agent-form" class="p-3 border-t border-slate-200 bg-white flex items-center space-x-2 shrink-0">
      <input type="text" id="chat-agent-input" autocomplete="off" placeholder="Pergunte algo sobre líderes ou equipes..." 
             class="flex-1 px-3 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-300 transition text-slate-800 placeholder-slate-400" />
      <button type="submit" class="bg-mag-dark hover:bg-slate-800 text-white p-2 rounded-xl transition shadow-md flex items-center justify-center focus:outline-none">
        <i data-lucide="send" class="w-4 h-4"></i>
      </button>
    </form>
  `;
  document.body.appendChild(chatWindow);

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // DOM Elements
  const messagesContainer = document.getElementById('chat-agent-messages');
  const inputElement = document.getElementById('chat-agent-input');
  const formElement = document.getElementById('chat-agent-form');
  const closeBtn = document.getElementById('chat-agent-close');
  const suggestionsContainer = document.getElementById('chat-agent-suggestions');

  let chatHistory = [];
  let isChatOpen = false;
  let activeLeaderIdAtOpen = null;

  // Toggle chat window
  function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      chatWindow.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
      chatWindow.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
      
      // Auto-focus input
      setTimeout(() => inputElement.focus(), 100);

      // Verify if selected leader changed since last open, if so say hi again or adapt suggestions
      if (activeLeaderIdAtOpen !== state.selectedLeaderId) {
        activeLeaderIdAtOpen = state.selectedLeaderId;
        renderSuggestions();
        
        // Show context update indicator if it's not the first time
        if (chatHistory.length > 0) {
          const leaderName = state.leaders.find(l => l.id === state.selectedLeaderId)?.nome || 'Líder';
          addSystemMessage(`Contexto atualizado para: **${leaderName}**`);
        }
      }
    } else {
      chatWindow.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
      chatWindow.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
    }
  }

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Render suggested question chips
  function renderSuggestions() {
    const leader = state.leaders.find(l => l.id === state.selectedLeaderId) || state.leaders[0];
    const firstName = leader.nome.split(' ')[0];
    
    const questions = [
      { text: `Resumo do ${firstName}`, query: `Quem é ${leader.nome}?` },
      { text: `Alertas do ${firstName}`, query: `Quais são os alertas do ${leader.nome}?` },
      { text: `Turnover da equipe`, query: `Qual o turnover do ${leader.nome}?` },
      { text: `Mapeamento de Sucessão`, query: `Quantos sucessores o ${leader.nome} tem?` },
      { text: `Comparar Scores`, query: `Quem tem o maior score geral?` }
    ];

    suggestionsContainer.innerHTML = '';
    questions.forEach(q => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'text-[11px] bg-slate-100 hover:bg-mag-dark hover:text-white border border-slate-200 text-slate-600 rounded-full px-2.5 py-1 transition font-medium focus:outline-none';
      btn.innerText = q.text;
      btn.addEventListener('click', () => {
        submitQuery(q.query);
      });
      suggestionsContainer.appendChild(btn);
    });
  }

  // Add Message to the Chat window
  function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} w-full animate-fade-in`;
    
    const bubbleClass = sender === 'user' 
      ? 'bg-mag-light text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 shadow-sm text-sm max-w-[85%]' 
      : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm text-sm max-w-[85%]';
      
    msg.innerHTML = `
      <div class="${bubbleClass}">
        ${parseMarkdown(text)}
      </div>
    `;
    
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to local history
    chatHistory.push({ sender, text });
  }

  // Add a system update message
  function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'flex justify-center w-full my-2 animate-fade-in';
    msg.innerHTML = `
      <div class="bg-slate-100/80 text-[10px] text-slate-500 rounded-lg px-2.5 py-1 border border-slate-200/50 font-medium">
        ${parseMarkdown(text)}
      </div>
    `;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing animation
  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'chat-agent-typing';
    typing.className = 'flex justify-start w-full animate-fade-in';
    typing.innerHTML = `
      <div class="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-3.5 py-3 shadow-sm text-sm max-w-[85%] flex items-center space-x-1.5">
        <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
        <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
        <span class="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
      </div>
    `;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove typing animation
  function removeTypingIndicator() {
    const typing = document.getElementById('chat-agent-typing');
    if (typing) {
      typing.remove();
    }
  }

  // Submit query
  function submitQuery(query) {
    if (!query || query.trim() === '') return;
    
    // Add user message
    addMessage('user', query);
    
    // Clear input
    inputElement.value = '';
    
    // Show typing
    showTypingIndicator();
    
    // Process response after a small premium delay (800ms)
    setTimeout(() => {
      removeTypingIndicator();
      const response = processAIQuery(query, state);
      addMessage('agent', response);
    }, 700);
  }

  // Handle Form Submission
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    submitQuery(inputElement.value);
  });

  // Render initial welcome message
  const initialLeader = state.leaders.find(l => l.id === state.selectedLeaderId) || state.leaders[0];
  addMessage('agent', `Olá! Sou o **Assistente de Gente (SIG²)**. 

Vejo que você está visualizando os dados de **${initialLeader.nome}** (${initialLeader.cargo}). Como posso te ajudar com as informações e indicadores dele ou de outros líderes da equipe?`);

  // Build initial suggestions
  renderSuggestions();
  activeLeaderIdAtOpen = state.selectedLeaderId;

  // Return a callback that can be triggered when application state updates
  return {
    onStateUpdate: (newState) => {
      state = newState;
      renderSuggestions();
      
      // If chat is open and selected leader changed, add a context message
      if (isChatOpen && activeLeaderIdAtOpen !== state.selectedLeaderId) {
        activeLeaderIdAtOpen = state.selectedLeaderId;
        const leaderName = state.leaders.find(l => l.id === state.selectedLeaderId)?.nome || 'Líder';
        addSystemMessage(`Contexto atualizado para: **${leaderName}**`);
      }
    }
  };
}
