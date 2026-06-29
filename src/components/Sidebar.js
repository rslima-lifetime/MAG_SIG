/**
 * Sidebar Component
 */
export function renderSidebar(activeTab, onTabChange, onActions) {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: 'layout-dashboard' },
    { id: 'results', label: 'Resultados do Negócio', icon: 'trending-up' },
    { id: 'people', label: 'Gestão de Pessoas', icon: 'users' },
    { id: 'development', label: 'Desenvolvimento', icon: 'graduation-cap' },
    { id: 'culture', label: 'Cultura', icon: 'heart' },
    { id: 'risk', label: 'Risco & Compliance', icon: 'shield-alert' },
    { id: 'history', label: 'Histórico', icon: 'history' },
    { id: 'comparatives', label: 'Comparativos', icon: 'bar-chart-3' },
    { id: 'team', label: 'Time & Estrutura', icon: 'git-branch' }
  ];

  const html = `
    <div class="flex flex-col h-full bg-mag-dark text-white w-64 border-r border-slate-800">
      <!-- Logo -->
      <div class="flex items-center px-6 py-4 border-b border-slate-800 h-[72px] bg-mag-dark">
        <img src="./src/assets/logo_mag.png" alt="MAG Seguros Logo" class="h-9 w-auto object-contain mx-auto" />
      </div>
      
      <!-- Menu Items -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        ${menuItems.map(item => {
          const isActive = activeTab === item.id;
          const activeBg = isActive ? 'bg-sky-900/50 border-l-4 border-sky-400 text-sky-300 font-medium' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white';
          return `
            <button 
              data-tab="${item.id}" 
              class="w-full flex items-center gap-3 px-4 py-3 text-sm rounded transition-all ${activeBg}"
            >
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              <span>${item.label}</span>
            </button>
          `;
        }).join('')}
      </nav>
      
      <!-- Footer -->
      <div class="p-4 border-t border-slate-800 space-y-1">
        <!-- Admin Import/Export actions inside sidebar footer -->
        <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800/60">
          <button 
            id="sidebar-btn-import" 
            title="Importar dados de um arquivo JSON" 
            class="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-2 rounded text-[11px] font-semibold transition-all border border-slate-700"
          >
            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
            <span>Importar</span>
          </button>
          
          <button 
            id="sidebar-btn-export" 
            title="Exportar base de dados atual como JSON" 
            class="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-2 rounded text-[11px] font-semibold transition-all border border-slate-700"
          >
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Exportar</span>
          </button>
        </div>

        <button 
          data-tab="help" 
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded transition-all"
        >
          <i data-lucide="help-circle" class="w-4 h-4"></i>
          <span>Ajuda</span>
        </button>
        <div class="text-[9px] text-center text-slate-600 mt-2">Dados Simulados (Demonstração)</div>
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
