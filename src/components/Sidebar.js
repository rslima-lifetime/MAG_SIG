/**
 * Sidebar Component
 */
export function renderSidebar(activeTab, onTabChange, onActions) {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: 'layout-dashboard' },
    { id: 'results', label: 'Resultados', icon: 'trending-up' },
    { id: 'people', label: 'Gestão', icon: 'users' },
    { id: 'development', label: 'Desenv.', icon: 'graduation-cap' },
    { id: 'culture', label: 'Cultura', icon: 'heart' },
    { id: 'risk', label: 'Risco', icon: 'shield-alert' },
    { id: 'history', label: 'Histórico', icon: 'history' },
    { id: 'comparatives', label: 'Comparativos', icon: 'bar-chart-3' },
    { id: 'team', label: 'Estrutura', icon: 'git-branch' }
  ];

  const html = `
    <div class="flex flex-col h-full bg-mag-dark text-white w-20 border-r border-slate-800 shrink-0">
      <!-- Logo -->
      <div class="flex items-center justify-center py-4 border-b border-slate-800 h-[72px] bg-mag-dark shrink-0">
        <img src="./src/assets/logo_mag.png" alt="MAG Seguros Logo" class="w-11 h-auto object-contain mx-auto" />
      </div>
      
      <!-- Menu Items -->
      <nav class="flex-1 py-4 space-y-1.5 overflow-y-auto scrollbar-none flex flex-col items-center">
        ${menuItems.map(item => {
          const isActive = activeTab === item.id;
          const activeBg = isActive 
            ? 'bg-sky-900/30 border-l-4 border-sky-400 text-sky-300 font-bold' 
            : 'text-slate-300 hover:bg-slate-800/40 hover:text-white';
          return `
            <button 
              data-tab="${item.id}" 
              title="${item.label}"
              class="w-full flex flex-col items-center justify-center py-2.5 px-1.5 text-center transition-all ${activeBg} focus:outline-none"
            >
              <i data-lucide="${item.icon}" class="w-5 h-5 mb-1 shrink-0"></i>
              <span class="text-[9px] leading-tight tracking-tight break-words font-semibold w-full text-center px-0.5">${item.label}</span>
            </button>
          `;
        }).join('')}
      </nav>
      
      <!-- Footer -->
      <div class="py-4 border-t border-slate-800 flex flex-col items-center gap-3 shrink-0">
        <!-- Admin Import/Export actions inside sidebar footer -->
        <div class="flex items-center justify-center gap-2 w-full px-2 pb-2 border-b border-slate-800/60 shrink-0">
          <button 
            id="sidebar-btn-import" 
            title="Importar dados de um arquivo JSON" 
            class="flex items-center justify-center w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 focus:outline-none"
          >
            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
          </button>
          
          <button 
            id="sidebar-btn-export" 
            title="Exportar base de dados atual como JSON" 
            class="flex items-center justify-center w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 focus:outline-none"
          >
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <button 
          data-tab="help" 
          title="Ajuda"
          class="w-full flex flex-col items-center justify-center py-1.5 px-1 text-center transition-all ${activeTab === 'help' ? 'text-sky-300 bg-sky-900/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'} focus:outline-none"
        >
          <i data-lucide="help-circle" class="w-5 h-5 mb-1 shrink-0"></i>
          <span class="text-[9px] leading-tight tracking-tight font-semibold">Ajuda</span>
        </button>
        <div class="text-[8px] text-center text-slate-600 leading-none mt-1 uppercase tracking-wider font-bold">SIG²</div>
      </div>
    </div>

    <!-- Hidden file input for import inside sidebar -->
    <input type="file" id="sidebar-import-file-input" accept=".json" class="hidden" />
  `;

  sidebarContainer.innerHTML = html;

  // Bind menu click events
  sidebarContainer.querySelectorAll('button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      onTabChange(tabId);
    });
  });

  // Bind actions click events
  if (onActions) {
    const fileInput = document.getElementById('sidebar-import-file-input');
    const btnImport = document.getElementById('sidebar-btn-import');
    const btnExport = document.getElementById('sidebar-btn-export');

    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          onActions('import', file);
        }
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        onActions('export');
      });
    }
  }

  // Re-run Lucide Icons rendering
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
