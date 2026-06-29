/**
 * Header Component
 */
export function renderHeader(leaders, selectedLeaderId, referencePeriod, selectedProfile, onFilterChange, onActions) {
  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) return;

  const html = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-b border-slate-200 px-6 py-4">
      <div class="flex items-center gap-3">
        <!-- SIG Logo Emblem -->
        <div class="bg-mag-dark p-1 rounded-lg flex items-center justify-center h-10 w-16 shadow-sm border border-slate-700">
          <img src="./src/assets/logo_sig.png" alt="SIG Logo" class="h-full w-auto object-contain" />
        </div>
        <div>
          <h1 class="text-sm font-black text-slate-800 tracking-tight leading-none">Sistema Integrado de Gente e Gestão</h1>
          <p class="text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider">SIG² • Painel Executivo</p>
        </div>
      </div>
      
      <!-- Filters & Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Perfil de Acesso -->
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Perfil de Acesso (Teste)</label>
          <select 
            id="filter-profile" 
            class="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-slate-700"
          >
            <option value="RH" ${selectedProfile === 'RH' ? 'selected' : ''}>RH Estratégico</option>
            <option value="BP" ${selectedProfile === 'BP' ? 'selected' : ''}>Business Partner (BP)</option>
            <option value="Diretor" ${selectedProfile === 'Diretor' ? 'selected' : ''}>Diretoria</option>
            <option value="Gestor" ${selectedProfile === 'Gestor' ? 'selected' : ''}>Gestor (Equipe)</option>
            <option value="Compliance" ${selectedProfile === 'Compliance' ? 'selected' : ''}>Compliance / Jurídico</option>
          </select>
        </div>

        <!-- Selecionar Líder -->
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Selecione um Líder</label>
          <select 
            id="filter-leader" 
            class="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-slate-700 w-44"
          >
            ${leaders.map(l => `
              <option value="${l.id}" ${l.id === selectedLeaderId ? 'selected' : ''}>${l.nome}</option>
            `).join('')}
          </select>
        </div>

        <!-- Período de Referência -->
        <div class="flex flex-col">
          <label class="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Período de Referência</label>
          <select 
            id="filter-period" 
            class="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-slate-700"
          >
            <option value="2025" ${referencePeriod === '2025' ? 'selected' : ''}>2025</option>
            <option value="2024" ${referencePeriod === '2024' ? 'selected' : ''}>2024</option>
            <option value="2023" ${referencePeriod === '2023' ? 'selected' : ''}>2023</option>
          </select>
        </div>

        <!-- Header Actions -->
        <div id="header-actions-container" class="flex items-end gap-1.5 pt-4 md:pt-0 pl-2 border-l border-slate-200 ml-2">
          <button 
            id="btn-print" 
            title="Imprimir Relatório Executivo" 
            class="flex items-center gap-1.5 bg-mag-dark hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold transition-all border border-slate-800 shadow-sm"
          >
            <i data-lucide="printer" class="w-3.5 h-3.5"></i>
            <span>Imprimir</span>
          </button>

          <button 
            id="btn-reset" 
            title="Limpar alterações do navegador e restaurar dados originais" 
            class="flex items-center justify-center text-slate-400 hover:text-red-600 p-1.5 rounded transition-all border border-transparent hover:border-slate-300 hover:bg-red-50" 
          >
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  headerContainer.innerHTML = html;

  // Bind Filters change events
  document.getElementById('filter-leader').addEventListener('change', (e) => {
    onFilterChange('leader', e.target.value);
  });

  document.getElementById('filter-period').addEventListener('change', (e) => {
    onFilterChange('period', e.target.value);
  });

  document.getElementById('filter-profile').addEventListener('change', (e) => {
    onFilterChange('profile', e.target.value);
  });

  // Bind Actions
  document.getElementById('btn-print').addEventListener('click', () => onActions('print'));
  document.getElementById('btn-reset').addEventListener('click', () => onActions('reset'));

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
