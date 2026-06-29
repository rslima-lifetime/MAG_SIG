/**
 * RetentionRadar Component - Renders the Radar de Retenção and detail modals.
 */

export function renderAlertBadge(severity) {
  let badgeColor = '';
  if (severity === 'Baixo') {
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (severity === 'Atenção') {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (severity === 'Prioridade') {
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
  } else if (severity === 'Crítico') {
    badgeColor = 'bg-red-100 text-red-800 border-red-200';
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}">${severity}</span>`;
}

export function renderRetentionRadarCard(alerts, leaderId, userProfile) {
  // Filter active alerts for this leader
  const activeAlerts = alerts.filter(a => a.leaderId === leaderId && a.status === 'Ativo');

  let severity = 'Baixo';
  let cardClass = 'bg-emerald-50/40 border-emerald-200/60 text-emerald-950';
  let statusBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let iconName = 'check-circle-2';

  if (activeAlerts.length > 0) {
    const hasCritical = activeAlerts.some(a => a.severity === 'Crítico');
    const hasPriority = activeAlerts.some(a => a.severity === 'Prioridade');
    const attentionCount = activeAlerts.filter(a => a.severity === 'Atenção').length;

    if (hasCritical) {
      severity = 'Crítico';
      cardClass = 'bg-red-50/50 border-red-200 text-red-950';
      statusBadgeColor = 'bg-red-100 text-red-800 border-red-200';
      iconName = 'alert-triangle';
    } else if (hasPriority || attentionCount >= 2) {
      severity = 'Prioridade';
      cardClass = 'bg-orange-50/50 border-orange-200 text-orange-950';
      statusBadgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
      iconName = 'alert-circle';
    } else {
      severity = 'Atenção';
      cardClass = 'bg-amber-50/50 border-amber-200 text-amber-950';
      statusBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
      iconName = 'info';
    }
  }

  return `
    <div class="flex flex-col justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full justify-between relative overflow-hidden animate-fade-in">
      <!-- Top: Status Header -->
      <div class="flex items-start justify-between gap-3 shrink-0">
        <div class="flex items-start gap-2.5 min-w-0">
          <div class="p-1.5 rounded-lg bg-${severity === 'Crítico' ? 'red' : severity === 'Prioridade' ? 'orange' : severity === 'Atenção' ? 'amber' : 'emerald'}-50 text-${severity === 'Crítico' ? 'red' : severity === 'Prioridade' ? 'orange' : severity === 'Atenção' ? 'amber' : 'emerald'}-600 shrink-0">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Radar de Retenção</h3>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border mt-1 ${statusBadgeColor}">${severity}</span>
          </div>
        </div>
        <span class="text-[8px] font-bold text-slate-300 uppercase tracking-wider shrink-0 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/50">Simulação</span>
      </div>

      <!-- Middle: Brief active alerts list or summary -->
      <div class="flex-1 my-3 flex flex-col justify-center min-h-[70px]">
        ${activeAlerts.length > 0 ? `
          <p class="text-[11px] font-bold text-slate-700 leading-tight">Sinais ativos (${activeAlerts.length}):</p>
          <ul class="mt-1.5 space-y-1 overflow-y-auto max-h-[75px] pr-1">
            ${activeAlerts.map(alert => {
              const hasAccess = alert.accessProfile.includes(userProfile) || alert.sensitivityLevel !== 'Restrita';
              const itemTitle = hasAccess ? alert.title : 'Informação restrita';
              return `
                <li class="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <span class="w-1 h-1 rounded-full ${alert.severity === 'Crítico' ? 'bg-red-500' : alert.severity === 'Prioridade' ? 'bg-orange-500' : 'bg-amber-500'} shrink-0"></span>
                  <span class="truncate" title="${itemTitle}">${itemTitle}</span>
                </li>
              `;
            }).join('')}
          </ul>
        ` : `
          <div class="flex items-center gap-2 text-slate-400">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0"></i>
            <span class="text-xs font-medium text-slate-500">Sem sinais relevantes ativos.</span>
          </div>
        `}
      </div>

      <!-- Bottom: Footer Button trigger details modal -->
      <div class="border-t border-slate-100 pt-3 mt-1 shrink-0 flex items-center justify-between">
        ${activeAlerts.length > 0 ? `
          <button id="btn-view-radar-details" class="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline focus:outline-none">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            Ver Detalhes e Ações (${activeAlerts.length})
          </button>
        ` : `
          <span class="text-[9px] text-slate-400 font-medium">Em conformidade</span>
        `}
        <span class="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Período: 2025</span>
      </div>
    </div>
  `;
}

export function renderRetentionAlertList(alerts, pillar, userProfile) {
  // Filter active alerts for this leader and pillar
  const pillarAlerts = alerts.filter(a => a.pillar === pillar && a.status === 'Ativo');

  if (pillarAlerts.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg text-center">
        <i data-lucide="check-circle-2" class="w-6 h-6 mb-2 text-emerald-500"></i>
        <p class="text-xs font-bold text-slate-700">Sem sinais relevantes no período.</p>
      </div>
    `;
  }

  const listHtml = pillarAlerts.map(alert => {
    const hasAccess = alert.accessProfile.includes(userProfile) || alert.sensitivityLevel !== 'Restrita';
    const severityBadge = renderAlertBadge(alert.severity);

    if (!hasAccess) {
      return `
        <div class="p-3 bg-red-50/30 border border-red-100 rounded-lg text-xs leading-relaxed flex items-start gap-2">
          <i data-lucide="shield-alert" class="w-4 h-4 text-red-500 shrink-0 mt-0.5"></i>
          <div class="flex-1">
            <div class="flex items-center gap-1.5 mb-1 flex-wrap">
              <span class="font-bold text-slate-800">Informação restrita</span>
              ${severityBadge}
            </div>
            <p class="text-slate-500 font-medium text-[10px]">Informação restrita. Acesso permitido apenas para perfis autorizados.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="p-3 bg-white border border-slate-200 rounded-lg text-xs hover:border-slate-300 transition-colors flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${alert.severity === 'Crítico' ? 'bg-red-500' : alert.severity === 'Prioridade' ? 'bg-orange-500' : 'bg-amber-500'}"></span>
            <span class="font-bold text-slate-800 leading-tight">${alert.title}</span>
          </div>
          ${severityBadge}
        </div>
        <p class="text-slate-600 font-medium leading-relaxed">${alert.description}</p>
        <div class="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-100">
          <span class="text-[9px] text-slate-400 italic">Fonte: ${alert.source}</span>
          <button class="text-sky-600 hover:text-sky-800 font-bold text-[10px] flex items-center gap-0.5 btn-detail-alert" data-alert-id="${alert.id}">
            <span>Ver detalhes</span>
            <i data-lucide="chevron-right" class="w-3 h-3"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-2">
      ${listHtml}
    </div>
  `;
}

export function showAlertDetailModal(alertId, alerts, userProfile) {
  const alertObj = alerts.find(a => a.id === alertId);
  if (!alertObj) return;

  const modal = document.getElementById('dimension-modal');
  const modalContent = document.getElementById('dimension-modal-content');
  if (!modal || !modalContent) return;

  const hasAccess = alertObj.accessProfile.includes(userProfile) || alertObj.sensitivityLevel !== 'Restrita';

  let contentHtml = '';

  if (!hasAccess) {
    contentHtml = `
      <div class="p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
          <i data-lucide="shield-alert" class="w-6 h-6"></i>
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-2">Acesso Restrito</h3>
        <p class="text-xs text-slate-500 mb-6 font-medium">Informação restrita. Acesso permitido apenas para perfis autorizados.</p>
        <button id="close-alert-modal" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded transition-all border border-slate-300">
          Fechar
        </button>
      </div>
    `;
  } else {
    const severityBadge = renderAlertBadge(alertObj.severity);
    const evidencesList = alertObj.evidence.map(e => `
      <li class="flex items-start gap-2 text-slate-600 text-xs py-1 border-b border-slate-100 last:border-0">
        <i data-lucide="circle-dot" class="w-3 h-3 text-slate-400 mt-1 shrink-0"></i>
        <span class="font-medium">${e}</span>
      </li>
    `).join('');

    contentHtml = `
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
        <div class="min-w-0">
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">${alertObj.pillar}</span>
          <h3 class="text-sm font-bold text-slate-800 truncate">${alertObj.title}</h3>
        </div>
        <div class="flex items-center gap-2">
          ${severityBadge}
          <button id="close-alert-modal" class="text-slate-400 hover:text-slate-600 p-1.5 rounded transition-all">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div class="px-6 py-5 overflow-y-auto space-y-4 max-h-[60vh] text-xs">
        <div>
          <h4 class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1">Descrição do Sinal</h4>
          <p class="text-slate-600 leading-relaxed font-medium">${alertObj.description}</p>
        </div>

        <div>
          <h4 class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1.5">Evidências Consolidadas</h4>
          <ul class="space-y-0.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
            ${evidencesList}
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">Período de Referência</h4>
            <p class="text-slate-700 font-bold">${alertObj.period}</p>
          </div>
          <div>
            <h4 class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">Nível de Sensibilidade</h4>
            <p class="text-slate-700 font-bold">${alertObj.sensitivityLevel}</p>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-0.5">Fonte dos Dados</h4>
          <p class="text-slate-600 italic font-medium">${alertObj.source}</p>
        </div>

        <div class="bg-amber-50 border border-amber-100 p-4 rounded-lg">
          <h4 class="font-bold text-amber-800 uppercase tracking-wider text-[9px] mb-1 flex items-center gap-1">
            <i data-lucide="info" class="w-3.5 h-3.5"></i>
            <span>Ação Sugerida</span>
          </h4>
          <p class="text-amber-900 leading-relaxed font-medium">${alertObj.suggestedAction}</p>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-[10px] text-slate-400">
        <span>Status: <span class="font-bold text-slate-600">${alertObj.status}</span></span>
        <span>Última atualização: ${alertObj.updatedAt}</span>
      </div>
    `;
  }

  modalContent.innerHTML = contentHtml;
  
  // Show Modal with Transitions
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);

  // Bind close events
  const closeModalFn = () => {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 150);
  };

  document.getElementById('close-alert-modal').addEventListener('click', closeModalFn);
  modal.onclick = (e) => {
    if (e.target === modal) closeModalFn();
  };

  if (window.lucide) window.lucide.createIcons();
}

export function showRadarAllAlertsModal(alerts, leaderId, userProfile) {
  const activeAlerts = alerts.filter(a => a.leaderId === leaderId && a.status === 'Ativo');
  if (activeAlerts.length === 0) return;

  const modal = document.getElementById('dimension-modal');
  const modalContent = document.getElementById('dimension-modal-content');
  if (!modal || !modalContent) return;

  let severity = 'Baixo';
  if (activeAlerts.some(a => a.severity === 'Crítico')) severity = 'Crítico';
  else if (activeAlerts.some(a => a.severity === 'Prioridade')) severity = 'Prioridade';
  else if (activeAlerts.some(a => a.severity === 'Atenção')) severity = 'Atenção';

  const statusBadgeColor = severity === 'Crítico' ? 'bg-red-100 text-red-800 border-red-200' : severity === 'Prioridade' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-amber-100 text-amber-800 border-amber-200';

  const alertsListHtml = activeAlerts.map((alert, idx) => {
    const hasAccess = alert.accessProfile.includes(userProfile) || alert.sensitivityLevel !== 'Restrita';
    const severityBadge = renderAlertBadge(alert.severity);

    if (!hasAccess) {
      return `
        <div class="p-4 bg-red-50/30 border border-red-100 text-slate-700 rounded-lg text-xs leading-relaxed flex items-start gap-3">
          <i data-lucide="shield-alert" class="w-4 h-4 text-red-500 shrink-0 mt-0.5"></i>
          <div class="flex-1">
            <div class="flex items-center gap-1.5 mb-1 flex-wrap">
              <span class="font-bold text-slate-800">Sinal ${idx + 1}: Informação Restrita</span>
              ${severityBadge}
            </div>
            <p class="text-slate-500 font-medium text-[10px]">Acesso permitido apenas para perfis autorizados de Gente & Gestão.</p>
          </div>
        </div>
      `;
    }

    const evidencesHtml = alert.evidence.map(ev => `
      <li class="flex items-start gap-1.5 py-0.5 text-slate-500">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5"></span>
        <span>${ev}</span>
      </li>
    `).join('');

    return `
      <div class="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition shadow-sm space-y-3">
        <div class="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${alert.severity === 'Crítico' ? 'bg-red-500' : alert.severity === 'Prioridade' ? 'bg-orange-500' : 'bg-amber-500'}"></span>
            <h4 class="font-bold text-slate-800 text-xs">${alert.title}</h4>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[9px] text-slate-400 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">${alert.pillar}</span>
            ${severityBadge}
          </div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed font-medium">${alert.description}</p>
        <div class="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 space-y-1.5">
          <span class="font-bold text-slate-600 uppercase tracking-wider text-[8px] block">Evidências:</span>
          <ul class="space-y-0.5">
            ${evidencesHtml}
          </ul>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs">
          <span class="font-bold text-amber-800 uppercase tracking-wider text-[9px] block mb-0.5">Ação Recomendada:</span>
          <p class="text-amber-900 leading-relaxed font-medium">${alert.suggestedAction}</p>
        </div>
      </div>
    `;
  }).join('');

  const contentHtml = `
    <!-- Header -->
    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
      <div class="min-w-0">
        <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="bell" class="w-4 h-4 text-sky-600"></i>
          <span>Radar de Retenção: Sinais de Alerta</span>
        </h3>
        <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Visão consolidada de riscos e ações sugeridas</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusBadgeColor}">${severity}</span>
        <button id="close-alert-modal" class="text-slate-400 hover:text-slate-600 p-1.5 rounded transition-all focus:outline-none">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
    
    <!-- Body -->
    <div class="px-6 py-5 overflow-y-auto space-y-4 max-h-[60vh] bg-slate-50/50">
      ${alertsListHtml}
    </div>
    
    <!-- Footer -->
    <div class="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-[10px] text-slate-400">
      <span>Período de Referência: <span class="font-bold text-slate-600">2025</span></span>
      <span>Total de Sinais: <span class="font-bold text-slate-600">${activeAlerts.length} ativo(s)</span></span>
    </div>
  `;

  modalContent.innerHTML = contentHtml;
  
  // Show Modal with Transitions
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);

  // Bind close events
  const closeModalFn = () => {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 150);
  };

  document.getElementById('close-alert-modal').addEventListener('click', closeModalFn);
  modal.onclick = (e) => {
    if (e.target === modal) closeModalFn();
  };

  if (window.lucide) window.lucide.createIcons();
}
