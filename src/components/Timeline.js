/**
 * Timeline / Team & Journey Component - Renders Layer 2 (Team X-Ray) and Layer 3 (Collaborator Journey)
 */

export function renderTeamAndJourney(leader, team, teamJourneyData, selectedProfile) {
  const mainWorkspace = document.getElementById('dashboard-workspace');
  if (!mainWorkspace) return;

  // Decidir se o parecer do liderado pode ser exibido com base no perfil
  const canShowHRDetails = selectedProfile === 'RH' || selectedProfile === 'BP';

  // Gerar o HTML para a seção de Time & Estrutura
  const html = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <!-- Coluna 1: Raio-X do Time (Layer 2) -->
      <div class="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
          <i data-lucide="users" class="w-5 h-5 text-sky-500"></i>
          Raio-X do Time Liderado
        </h3>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p class="text-[9px] uppercase font-bold text-slate-400">Headcount</p>
            <p class="text-lg font-black text-slate-800">${team.headcount} pessoas</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p class="text-[9px] uppercase font-bold text-slate-400">Turnover Anual</p>
            <p class="text-lg font-black ${parseInt(team.turnover) > 10 ? 'text-amber-600' : 'text-slate-800'}">${team.turnover}</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p class="text-[9px] uppercase font-bold text-slate-400">Absenteísmo</p>
            <p class="text-lg font-black text-slate-800">${team.absenteismo}</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p class="text-[9px] uppercase font-bold text-slate-400">Talentos-Chave</p>
            <p class="text-lg font-black text-sky-600">${team.colaboradoresChave} identificados</p>
          </div>
        </div>

        <!-- Gestão do Clima e Ponto -->
        <div class="space-y-3">
          <div class="flex justify-between items-center text-xs py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Clima da Equipe (GPTW)</span>
            <span class="font-bold text-slate-800">${team.climaTime}</span>
          </div>
          <div class="flex justify-between items-center text-xs py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Gestão de Ponto</span>
            <span class="font-bold text-slate-800">${team.gestaoPonto}</span>
          </div>
          <div class="flex justify-between items-center text-xs py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Aprovação de Férias</span>
            <span class="font-bold text-slate-800">${team.aprovacaoFerias}</span>
          </div>
          <div class="flex justify-between items-center text-xs py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Engajamento no Ciclo</span>
            <span class="font-bold text-slate-800">${team.engajamentoCiclo}</span>
          </div>
          <div class="flex justify-between items-center text-xs py-2 text-red-600 font-bold bg-red-50 px-2 rounded">
            <span class="font-medium">Pendências de Gestão</span>
            <span>${team.pendenciasGestao} pendentes</span>
          </div>
        </div>
      </div>

      <!-- Coluna 2: Lista de Liderados -->
      <div class="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
          <i data-lucide="user-check" class="w-5 h-5 text-teal-500"></i>
          Colaboradores Liderados
        </h3>
        <p class="text-[11px] text-slate-400 mb-3">Selecione um profissional para carregar sua Jornada Viva (Layer 3):</p>
        
        <div class="flex-1 space-y-2 overflow-y-auto max-h-[360px] pr-1" id="liderados-list-container">
          ${teamJourneyData.liderados.map((lid, idx) => `
            <button 
              data-liderado-id="${lid.id}" 
              class="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50/20 transition-all flex items-center justify-between group ${idx === 0 ? 'border-sky-500 bg-sky-50/30' : ''}"
            >
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 truncate">${lid.nome}</p>
                <p class="text-[10px] text-slate-500 mt-0.5 truncate">${lid.cargo}</p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span class="text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 uppercase">
                  ${lid.potencial}
                </span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-all"></i>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Coluna 3: Jornada Individual do Liderado (Layer 3) -->
      <div class="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between" id="jornada-detalhe-container">
        <!-- Será preenchido dinamicamente ao clicar -->
      </div>
    </div>
  `;

  mainWorkspace.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Função interna para renderizar o detalhe da jornada do liderado
  const renderLideradoDetail = (lideradoId) => {
    const detailContainer = document.getElementById('jornada-detalhe-container');
    if (!detailContainer) return;

    const lid = teamJourneyData.liderados.find(l => l.id === lideradoId);
    if (!lid) return;

    detailContainer.innerHTML = `
      <div class="flex flex-col h-full justify-between animate-fade-in">
        <div>
          <div class="flex items-start justify-between border-b border-slate-100 pb-3 mb-3.5">
            <div>
              <h4 class="text-xs font-black text-slate-800 leading-none">${lid.nome}</h4>
              <p class="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">${lid.cargo}</p>
            </div>
            <span class="text-[10px] bg-sky-100 text-sky-700 font-black px-2 py-0.5 rounded-full uppercase">
              Potencial: ${lid.potencial}
            </span>
          </div>
          
          <div class="space-y-3 text-xs">
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Tempo de Casa / Cargo</span>
              <span class="font-bold text-slate-700">${lid.tempoCasa} / no cargo há ${lid.tempoCargo}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Histórico de Movimentações</span>
              <span class="font-semibold text-slate-600">${lid.ultimaMovimentacao}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">PDI e Treinamentos (MAG Univ)</span>
              <span class="font-bold text-slate-700 flex items-center gap-1">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i>
                PDI ${lid.pdi} • ${lid.treinamentos} concluídos
              </span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Projetos estratégicos</span>
              <span class="font-semibold text-slate-600">${lid.projetos}</span>
            </div>
          </div>
        </div>
        
        <div class="border-t border-slate-100 pt-4 mt-4">
          <p class="text-[10px] text-slate-400 uppercase font-bold mb-1.5">Parecer do RH BP</p>
          ${canShowHRDetails ? `
            <div class="bg-slate-50 border border-slate-150 rounded-lg p-3 text-[11px] text-slate-600 leading-normal italic">
              "${lid.parecer}"
            </div>
            <div class="flex items-center gap-1.5 mt-2.5 text-[9px] font-bold text-slate-400">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-slate-300"></i>
              <span>Mapeado em Ciclo de Sucessão da MAG</span>
            </div>
          ` : `
            <div class="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400">
              <i data-lucide="lock" class="w-4 h-4 mx-auto mb-1.5 text-slate-300"></i>
              <p class="text-[10px] font-bold">Acesso Restrito</p>
              <p class="text-[9px] text-slate-400 leading-normal mt-0.5">Parecer de RH restrito a perfis autorizados (RH Estratégico ou BP).</p>
            </div>
          `}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  // Renderizar o primeiro da lista por padrão
  if (teamJourneyData.liderados.length > 0) {
    renderLideradoDetail(teamJourneyData.liderados[0].id);
  }

  // Configurar cliques nos botões de liderados
  const buttons = mainWorkspace.querySelectorAll('button[data-liderado-id]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover destaque anterior
      buttons.forEach(b => {
        b.classList.remove('border-sky-500', 'bg-sky-50/30');
        b.classList.add('border-slate-200');
      });
      // Destacar o atual
      btn.classList.remove('border-slate-200');
      btn.classList.add('border-sky-500', 'bg-sky-50/30');
      
      const lideradoId = btn.getAttribute('data-liderado-id');
      renderLideradoDetail(lideradoId);
    });
  });
}
