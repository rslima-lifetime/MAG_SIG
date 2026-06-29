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
  let message = 'Sem sinal relevante no período.';
  let cardClass = 'bg-emerald-50/40 border-emerald-200/60 text-emerald-900';
  let statusBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let iconName = 'check-circle-2';

  if (activeAlerts.length > 0) {
    const hasCritical = activeAlerts.some(a => a.severity === 'Crítico');
    const hasPriority = activeAlerts.some(a => a.severity === 'Prioridade');
    const attentionCount = activeAlerts.filter(a => a.severity === 'Atenção').length;

    if (hasCritical) {
      severity = 'Crítico';
      message = 'Existem sinais críticos que exigem validação imediata com Gente & Gestão.';
      cardClass = 'bg-red-50/50 border-red-200 text-red-900';
      statusBadgeColor = 'bg-red-100 text-red-800 border-red-200';
      iconName = 'alert-triangle';
    } else if (hasPriority || attentionCount >= 2) {
      severity = 'Prioridade';
      message = 'Existem sinais relevantes que exigem ação preventiva.';
      cardClass = 'bg-orange-50/50 border-orange-200 text-orange-900';
      statusBadgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
      iconName = 'alert-circle';
    } else {
      severity = 'Atenção';
      message = 'Existem sinais que merecem acompanhamento.';
      cardClass = 'bg-amber-50/50 border-amber-200 text-amber-900';
      statusBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
      iconName = 'info';
    }
  }

  // Render principal alert details if active
  let alertDetailsHtml = '';
  if (activeAlerts.length > 0) {
    const listHtml = activeAlerts.map(alert => {
      const hasAccess = alert.accessProfile.includes(userProfile) || alert.sensitivityLevel !== 'Restrita';
      const itemTitle = hasAccess ? alert.title : 'Informação restrita com acesso restrito';
      
      return `
        <li class="flex items-center justify-between text-xs py-1 border-b border-slate-100/50 last:border-0">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full ${alert.severity === 'Crítico' ? 'bg-red-500' : alert.severity === 'Prioridade' ? 'bg-orange-500' : 'bg-amber-500'}"></span>
            <span class="font-medium text-slate-700 truncate">${itemTitle}</span>
            <span class="text-[9px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-bold uppercase shrink-0">${alert.pillar}</span>
          </div>
          <button class="text-sky-600 hover:text-sky-800 font-bold shrink-0 text-[10px] ml-4 flex items-center gap-0.5 btn-detail-alert" data-alert-id="${alert.id}">
            <span>Detalhar</span>
            <i data-lucide="chevron-right" class="w-3 h-3"></i>
          </button>
        </li>
      `;
    }).join('');

    // Worst or main suggested action
    const mainAlert = activeAlerts.find(a => a.severity === severity) || activeAlerts[0];
    const hasMainAccess = mainAlert.accessProfile.includes(userProfile) || mainAlert.sensitivityLevel !== 'Restrita';
    
    let suggestedActionHtml = '';
    if ((severity === 'Prioridade' || severity === 'Crítico') && hasMainAccess) {
      suggestedActionHtml = `
        <div class="mt-3 pt-3 border-t border-slate-200/60 text-xs">
          <span class="font-bold text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Ação Sugerida</span>
          <p class="text-slate-600 leading-relaxed font-medium">${mainAlert.suggestedAction}</p>
        </div>
      `;
    }

    alertDetailsHtml = `
      <div class="mt-3 bg-white p-3 rounded-lg border border-slate-100/80 shadow-sm">
        <span class="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1.5">Sinais Ativos (${activeAlerts.length})</span>
        <ul class="divide-y divide-slate-100">
          ${listHtml}
        </ul>
        ${suggestedActionHtml}
      </div>
    `;
  }

  return `
    <div class="rounded-xl border p-4 shadow-sm transition-all animate-fade-in ${cardClass}">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-white/80 border border-slate-100 text-slate-700 shrink-0 mt-0.5 shadow-xs">
            <i data-lucide="${iconName}" class="w-5 h-5 ${severity === 'Crítico' ? 'text-red-600' : severity === 'Prioridade' ? 'text-orange-600' : severity === 'Atenção' ? 'text-amber-600' : 'text-emerald-600'}"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-black text-slate-800 tracking-tight">Radar de Retenção</h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${statusBadgeColor}">${severity}</span>
            </div>
            <p class="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">Sinais que exigem atenção sobre retenção, saída e estabilidade do time.</p>
            <p class="text-xs font-bold text-slate-800 mt-2 leading-relaxed">${message}</p>
          </div>
        </div>
        
        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-white/45 px-2 py-1 rounded border border-slate-200/40 shrink-0 self-start md:self-auto text-center">
          Dado simulado
        </div>
      </div>

      ${alertDetailsHtml}

      <p class="text-[9px] text-slate-400 mt-3 italic leading-none font-medium">O Radar de Retenção consolida sinais de saída, retenção, clima, desenvolvimento e governança para apoiar decisões preventivas de Gente & Gestão.</p>
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
