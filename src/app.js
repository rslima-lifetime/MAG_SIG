/**
 * MAG Gente 360 - Main Application Entrypoint
 */

import { renderHeader } from './components/Header.js';
import { renderSidebar } from './components/Sidebar.js';
import {
  renderProfileCard,
  renderDimensionCard,
  renderDimensionSummaryCard,
  renderDimensionExpandedCard
} from './components/Cards.js';
import { renderHealthScore } from './components/HealthScore.js';
import {
  renderHistoricalTable,
  renderOtherIndicators,
  renderLatestAchievements,
  renderHRFeedback
} from './components/Tables.js';
import { renderTeamAndJourney } from './components/Timeline.js';
import { renderRetentionRadarCard, renderRetentionAlertList, showAlertDetailModal } from './components/RetentionRadar.js';
import { initChatAgent } from './components/ChatAgent.js';
import { renderDimensionWorkspace } from './components/DimensionWorkspace.js';

// Application State
let state = {
  leaders: [],
  team: {},
  journey: {},
  indicators: {},
  alerts: [],
  selectedLeaderId: 'joao-silva',
  referencePeriod: '2025',
  selectedProfile: 'RH',
  activeTab: 'overview',
  selectedIndicatorId: null
};

let chatAgentInstance = null;

/**
 * Load data from localStorage or fetch standard JSON files
 */
async function initDatabase() {
  const cachedData = localStorage.getItem('mag_gente_360_db');
  if (cachedData) {
    try {
      const db = JSON.parse(cachedData);
      state.leaders = db.leaders;
      state.team = db.team;
      state.journey = db.journey;
      state.indicators = db.indicators;
      state.alerts = db.alerts || [];
      console.log('Database loaded from localStorage.');
      return;
    } catch (e) {
      console.error('Error parsing cached database, re-fetching defaults.', e);
    }
  }

  // Fetch standard default JSONs in parallel
  try {
    const [resLeaders, resTeam, resJourney, resIndicators, resAlerts] = await Promise.all([
      fetch('./src/data/mockLeadership.json').then(r => r.json()),
      fetch('./src/data/mockTeam.json').then(r => r.json()),
      fetch('./src/data/mockJourney.json').then(r => r.json()),
      fetch('./src/data/mockIndicators.json').then(r => r.json()),
      fetch('./src/data/mockAlerts.json').then(r => r.json()).catch(() => [])
    ]);

    state.leaders = resLeaders;
    state.team = resTeam;
    state.journey = resJourney;
    state.indicators = resIndicators;
    state.alerts = resAlerts;

    // Save to localStorage
    saveToLocalStorage();
    console.log('Database initialized from JSON files.');
  } catch (err) {
    console.error('Critical: Failed to fetch mock data JSONs!', err);
    alert('Erro ao carregar dados simulados. Certifique-se de estar rodando via servidor local.');
  }
}

function saveToLocalStorage() {
  const db = {
    leaders: state.leaders,
    team: state.team,
    journey: state.journey,
    indicators: state.indicators,
    alerts: state.alerts
  };
  localStorage.setItem('mag_gente_360_db', JSON.stringify(db));
}

/**
 * Renders active screen workspace
 */
function renderWorkspace() {
  const leader = state.leaders.find(l => l.id === state.selectedLeaderId);
  if (!leader) return;

  const team = state.team[state.selectedLeaderId] || {};
  const journey = state.journey.leaders[state.selectedLeaderId] || {
    timeline: [],
    conquistas: [],
    parecerRH: { autor: 'A definir', cargo: 'N/A', data: '-', conteudo: 'Dados insuficientes', avatar: '' },
    liderados: []
  };

  const mainWorkspace = document.getElementById('dashboard-workspace');
  if (!mainWorkspace) return;

  const getPillarWorstSeverity = (pillarAlerts) => {
    if (pillarAlerts.length === 0) return 'Baixo';
    if (pillarAlerts.some(a => a.severity === 'Crítico')) return 'Crítico';
    if (pillarAlerts.some(a => a.severity === 'Prioridade')) return 'Prioridade';
    if (pillarAlerts.some(a => a.severity === 'Atenção')) return 'Atenção';
    return 'Baixo';
  };

  // Governance Flags
  const showHRFeedbackSensitive = state.selectedProfile === 'RH' || state.selectedProfile === 'BP';
  const showRiscoSensitive = state.selectedProfile === 'RH' || state.selectedProfile === 'Compliance';

  if (state.activeTab === 'team') {
    // Renders Layer 2 (Team) and Layer 3 (Journey) side by side
    renderTeamAndJourney(leader, team, journey, state.selectedProfile);
    return;
  }

  if (state.activeTab !== 'overview') {
    // Focused view for specific dimension tabs
    let dimensionKey = '';
    if (state.activeTab === 'results') dimensionKey = 'Resultado';
    else if (state.activeTab === 'people') dimensionKey = 'Gestao';
    else if (state.activeTab === 'development') dimensionKey = 'Desenvolvimento';
    else if (state.activeTab === 'culture') dimensionKey = 'Cultura';
    else if (state.activeTab === 'risk') dimensionKey = 'Risco';
    else if (state.activeTab === 'history') {
      mainWorkspace.innerHTML = `
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in" id="historical-table-container"></div>
      `;
      renderHistoricalTable(journey.timeline);
      return;
    }

    if (dimensionKey) {
      renderDimensionWorkspace(mainWorkspace, dimensionKey, state, (indicatorId) => {
        state.selectedIndicatorId = indicatorId;
        renderWorkspace();
      });
      return;
    }

    mainWorkspace.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-200 rounded-xl shadow-sm h-64 animate-fade-in">
        <i data-lucide="help-circle" class="w-8 h-8 mb-3 text-slate-300"></i>
        <p class="text-sm font-bold">Tela em Construção</p>
        <p class="text-xs text-slate-400 mt-1">A visualização desta aba está sendo modelada.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Render Visão Geral (Standard Dashboard View)
  mainWorkspace.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      <!-- Central/Main Column (col-span-9) -->
      <div class="lg:col-span-9 space-y-6">
        <!-- Top Profile & Health row -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5" id="profile-card-container"></div>
          <div class="lg:col-span-7" id="health-score-container"></div>
        </div>
        
        <!-- Main 5 Dimensions Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" id="dimensions-cards-container">
          <div id="dim-resultado"></div>
          <div id="dim-gestao"></div>
          <div id="dim-desenvolvimento"></div>
          <div id="dim-cultura"></div>
          <div id="dim-risco"></div>
        </div>
        
        <!-- Bottom History, Achievements, Feedback row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="historical-table-container"></div>
          <div id="other-indicators-container"></div>
          <div id="latest-achievements-container"></div>
          <div id="hr-feedback-container"></div>
        </div>
      </div>
      
      <!-- Right Sidebar Column: Retention Radar (col-span-3) -->
      <div class="lg:col-span-3 lg:sticky lg:top-6" id="retention-radar-container"></div>

    </div>
  `;

  // Render profile, health score cards
  const isYearDestaque = journey.timeline.find(t => t.ano === state.referencePeriod)?.destaque || false;
  renderProfileCard(leader, isYearDestaque);
  renderHealthScore(leader.scoreGeral, leader.scoresPorDimensao);

  // Render Retention Radar Card
  const radarContainer = document.getElementById('retention-radar-container');
  if (radarContainer) {
    radarContainer.innerHTML = renderRetentionRadarCard(state.alerts, state.selectedLeaderId, state.selectedProfile);
    
    // Bind detail buttons inside the radar card
    radarContainer.querySelectorAll('.btn-detail-alert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const alertId = btn.getAttribute('data-alert-id');
        showAlertDetailModal(alertId, state.alerts, state.selectedProfile);
      });
    });
  }

  // Map and Render Dimension Cards
  const dimensions = [
    { id: 'Resultado', title: 'Resultados do Negócio', color: 'blue', targetId: 'dim-resultado' },
    { id: 'Gestao', title: 'Gestão de Pessoas', color: 'teal', targetId: 'dim-gestao' },
    { id: 'Desenvolvimento', title: 'Desenvolvimento', color: 'purple', targetId: 'dim-desenvolvimento' },
    { id: 'Cultura', title: 'Cultura', color: 'orange', targetId: 'dim-cultura' },
    { id: 'Risco', title: 'Risco & Compliance', color: 'red', targetId: 'dim-risco' }
  ];

  // Render Bottom sections
  renderHistoricalTable(journey.timeline);
  renderOtherIndicators(team);
  renderLatestAchievements(journey.conquistas);
  renderHRFeedback(journey.parecerRH, showHRFeedbackSensitive);

  const navigateToTab = (dimId) => {
    let targetTabId = '';
    if (dimId === 'Resultado') targetTabId = 'results';
    else if (dimId === 'Gestao') targetTabId = 'people';
    else if (dimId === 'Desenvolvimento') targetTabId = 'development';
    else if (dimId === 'Cultura') targetTabId = 'culture';
    else if (dimId === 'Risco') targetTabId = 'risk';
    
    const sidebarBtn = document.querySelector(`button[data-tab="${targetTabId}"]`);
    if (sidebarBtn) sidebarBtn.click();
  };

  // Keep track of the active expanded dimension ID
  let activeExpandedDimId = null;

  const renderCardState = (dim, isExpanded) => {
    const wrapper = document.getElementById(dim.targetId);
    if (!wrapper) return;

    const score = leader.scoresPorDimensao[dim.id];
    
    // Get worst alert severity for the pillar
    const pillarAlerts = state.alerts.filter(a => a.leaderId === state.selectedLeaderId && a.status === 'Ativo' && a.pillar === dim.title);
    const worstSeverity = getPillarWorstSeverity(pillarAlerts);
    
    if (isExpanded) {
      const rawIndicators = state.indicators[dim.id] || [];
      const processedIndicators = mapIndicatorsValues(rawIndicators, team, leader, journey);
      wrapper.innerHTML = renderDimensionExpandedCard(dim.id, dim.title, dim.color, processedIndicators, score, showRiscoSensitive, worstSeverity);
      
      // Bind navigate event inside expanded card
      wrapper.querySelector('.modal-navigate-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateToTab(dim.id);
      });
      
      // Bind collapse event on click of the expanded card (except navigate button)
      const expandedCard = wrapper.querySelector('.dimension-expanded-card');
      expandedCard.addEventListener('click', (e) => {
        if (e.target.closest('.modal-navigate-btn')) return;
        
        e.stopPropagation();
        activeExpandedDimId = null;
        renderCardState(dim, false);
      });
    } else {
      wrapper.innerHTML = renderDimensionSummaryCard(dim.id, dim.title, dim.color, score, worstSeverity);
      
      // Bind expand event inside summary card
      wrapper.querySelector('.dimension-summary-card').addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Collapse any other open cards first to keep the grid neat
        dimensions.forEach(otherDim => {
          if (otherDim.id !== dim.id) {
            renderCardState(otherDim, false);
          }
        });
        
        activeExpandedDimId = dim.id;
        renderCardState(dim, true);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  };

  // Render all cards initially as summary (collapsed)
  dimensions.forEach(dim => {
    renderCardState(dim, false);
  });

  // Handle click outside to close the drawer/expanded card
  const handleOutsideClick = (e) => {
    const clickedCard = e.target.closest('.dimension-summary-card');
    const clickedExpanded = e.target.closest('.dimension-expanded-card');
    
    if (!clickedCard && !clickedExpanded && activeExpandedDimId !== null) {
      const currentDim = dimensions.find(d => d.id === activeExpandedDimId);
      if (currentDim) {
        activeExpandedDimId = null;
        renderCardState(currentDim, false);
      }
    }
  };

  document.removeEventListener('click', handleOutsideClick);
  document.addEventListener('click', handleOutsideClick);
}

/**
 * Map values dynamically to indicator matrices based on active leader data
 */
function mapIndicatorsValues(rawIndicators, team, leader, journey) {
  return rawIndicators.map(ind => {
    let val = 'N/A';
    let status = 'default';

    if (ind.id === 4) { // Resultado de vendas
      val = leader.tipoPerfil === 'Comercial' ? (leader.id === 'joao-silva' ? 'R$ 28,4 MM' : leader.id === 'ana-souza' ? 'R$ 72,3 MM' : 'R$ 24,5 MM') : 'Dados insuficientes';
      status = val === 'Dados insuficientes' ? 'default' : 'success';
    } else if (ind.id === 13) { // Metas individuais
      val = leader.id === 'joao-silva' ? '92%' : leader.id === 'ana-souza' ? '98%' : leader.id === 'carlos-lima' ? '85%' : leader.id === 'patricia-alves' ? '93%' : '72%';
      status = parseInt(val) >= 90 ? 'success' : 'warning';
    } else if (ind.id === 6) { // Performance treinandos
      val = team.performanceTreinandos || 'N/A';
      status = val === 'N/A' ? 'default' : 'success';
    } else if (ind.id === 14) { // Projetos chave
      val = leader.id === 'joao-silva' ? '4 ativas' : leader.id === 'ana-souza' ? '6 ativas' : leader.id === 'carlos-lima' ? '2 ativas' : leader.id === 'patricia-alves' ? '3 ativas' : '1 ativa';
      status = 'success';
    } else if (ind.id === 18) { // Premiação campanhas
      val = leader.id === 'joao-silva' ? 'Galo de Ouro' : leader.id === 'ana-souza' ? 'Galo de Ouro Master' : leader.id === 'joao-ribeiro' ? 'Galo de Ouro Regional' : 'N/A';
      status = val === 'N/A' ? 'default' : 'success';
    } else if (ind.id === 2) { // Ciclo de Gente
      val = leader.potencial;
      status = leader.potencialSigla === 'A' ? 'success' : 'warning';
    } else if (ind.id === 3) { // GPTW
      val = team.climaTime || 'N/A';
      status = 'success';
    } else if (ind.id === 8) { // Turnover
      val = team.turnover || '0%';
      const numVal = parseInt(val);
      status = numVal > 12 ? 'danger' : numVal > 8 ? 'warning' : 'success';
    } else if (ind.id === 5) { // Treinandos por gestor
      val = team.treinandos !== undefined ? `${team.treinandos} pessoas` : 'N/A';
      status = 'default';
    } else if (ind.id === 7) { // Colaboradores-chave
      val = team.colaboradoresChave !== undefined ? `${team.colaboradoresChave} identificados` : '0';
      status = 'success';
    } else if (ind.id === 12) { // Sucessão
      val = team.sucessores !== undefined ? `${team.sucessores} prontos agora` : '0';
      status = 'success';
    } else if (ind.id === 21) { // Gestão de pessoas
      val = team.gestaoPonto || 'N/A';
      status = parseInt(val) >= 90 ? 'success' : 'warning';
    } else if (ind.id === 10) { // Treinamentos obrigatórios
      val = leader.id === 'carlos-lima' ? '82%' : '100% em dia';
      status = val === '100% em dia' ? 'success' : 'warning';
    } else if (ind.id === 16) { // Treinamentos MAG Univ
      val = leader.id === 'joao-silva' ? '42h no ano' : leader.id === 'ana-souza' ? '66h no ano' : leader.id === 'carlos-lima' ? '18h no ano' : leader.id === 'patricia-alves' ? '54h no ano' : '24h no ano';
      status = 'success';
    } else if (ind.id === 11) { // Treinamentos liderança
      val = leader.id === 'joao-silva' ? '24h no ano' : leader.id === 'ana-souza' ? '40h no ano' : leader.id === 'carlos-lima' ? '8h no ano' : leader.id === 'patricia-alves' ? '30h no ano' : '12h no ano';
      status = 'success';
    } else if (ind.id === 17) { // Histórico extracurricular
      val = leader.id === 'joao-silva' ? 'MBA Executivo FGV' : leader.id === 'ana-souza' ? 'MBA Gestão Vendas' : leader.id === 'patricia-alves' ? 'MBA Arquitetura TI' : 'N/A';
      status = val === 'N/A' ? 'default' : 'success';
    } else if (ind.id === 19) { // Projetos internos
      val = leader.id === 'joao-silva' ? '3 participações' : leader.id === 'ana-souza' ? '5 participações' : 'N/A';
      status = val === 'N/A' ? 'default' : 'success';
    } else if (ind.id === 20) { // Parecer RH
      val = journey.parecerRH.conteudo ? 'Favorável' : 'A definir';
      if (leader.id === 'joao-ribeiro') val = 'Atenção Crítica';
      status = val === 'Favorável' ? 'success' : 'danger';
    } else if (ind.id === 1) { // Denúncias (Risco)
      const count = journey.timeline.find(t => t.ano === state.referencePeriod)?.denuncias || 0;
      val = count > 0 ? `${count} pendente(s)` : '0 no período';
      status = count > 0 ? 'danger' : 'success';
    } else if (ind.id === 9) { // Aprovações legais
      val = leader.id === 'joao-ribeiro' ? '85%' : '100% em dia';
      status = val === '100% em dia' ? 'success' : 'warning';
    }

    return {
      id: ind.id,
      nome: ind.nome,
      valor: val,
      status: status
    };
  });
}

/**
 * Redraws complete page layout
 */
function renderApp() {
  const handleTabChange = (tabId) => {
    state.activeTab = tabId;
    state.selectedIndicatorId = null;
    renderSidebar(state.activeTab, handleTabChange, handleActionsCall);
    renderWorkspace();
  };

  const handleFilterChange = (type, val) => {
    if (type === 'leader') {
      state.selectedLeaderId = val;
      state.selectedIndicatorId = null;
    }
    else if (type === 'period') state.referencePeriod = val;
    else if (type === 'profile') state.selectedProfile = val;
    
    renderHeader(state.leaders, state.selectedLeaderId, state.referencePeriod, state.selectedProfile, handleFilterChange, handleActionsCall);
    renderWorkspace();
    
    if (chatAgentInstance) {
      chatAgentInstance.onStateUpdate(state);
    }
  };

  const handleActionsCall = (actionName, file) => {
    handleActions(actionName, file);
  };

  renderSidebar(state.activeTab, handleTabChange, handleActionsCall);
  renderHeader(state.leaders, state.selectedLeaderId, state.referencePeriod, state.selectedProfile, handleFilterChange, handleActionsCall);
  renderWorkspace();
}

/**
 * Handles import, export, print, and reset actions
 */
function handleActions(actionName, file) {
  if (actionName === 'print') {
    window.print();
  } else if (actionName === 'export') {
    const db = {
      leaders: state.leaders,
      team: state.team,
      journey: state.journey,
      indicators: state.indicators,
      alerts: state.alerts
    };
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mag-gente-360-dados-${state.selectedLeaderId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('Database exported successfully.');
  } else if (actionName === 'reset') {
    if (confirm('Deseja limpar as alterações locais e restaurar os dados padrão?')) {
      localStorage.removeItem('mag_gente_360_db');
      location.reload();
    }
  } else if (actionName === 'import' && file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const db = JSON.parse(e.target.result);
        if (db.leaders && db.team && db.journey && db.indicators) {
          state.leaders = db.leaders;
          state.team = db.team;
          state.journey = db.journey;
          state.indicators = db.indicators;
          state.alerts = db.alerts || [];
          
          saveToLocalStorage();
          alert('Dados importados com sucesso!');
          renderApp();
          if (chatAgentInstance) {
            chatAgentInstance.onStateUpdate(state);
          }
        } else {
          alert('Erro: A estrutura do JSON importado é inválida. Certifique-se de que é um arquivo gerado pela exportação do SIG.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo JSON. Certifique-se de que o formato do arquivo está correto.');
      }
    };
    reader.readAsText(file);
  }
}

async function removeLogoBackground() {
  if (localStorage.getItem('logo_bg_removed_v2')) return;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "./src/assets/logo.png";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Background threshold: if the pixel is dark blue/black
        if (r < 25 && g < 30 && b < 55) {
          data[i+3] = 0; // Set alpha to 0 (transparent)
        } else {
          // Soft edge alpha transition for very dark pixels that are close to the threshold
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luminance < 35) {
            data[i+3] = Math.round((luminance / 35) * 255);
          }
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      
      fetch('/save-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataUrl })
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          localStorage.setItem('logo_bg_removed_v2', 'true');
          console.log('Logo background removed successfully!');
          resolve();
          window.location.reload();
        } else {
          resolve();
        }
      })
      .catch(err => {
        console.error('Error saving transparent logo:', err);
        resolve();
      });
    };

    img.onerror = () => {
      resolve();
    };
  });
}

// Start application
window.addEventListener('DOMContentLoaded', async () => {
  await removeLogoBackground();
  await initDatabase();
  renderApp();
  
  // Inicializa o Chat Agent
  chatAgentInstance = initChatAgent(state, (leaderId) => {
    state.selectedLeaderId = leaderId;
    renderApp();
    if (chatAgentInstance) {
      chatAgentInstance.onStateUpdate(state);
    }
  });
});
