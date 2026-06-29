/**
 * Cards Component - Renders Leadership Profile, Dimension Cards, and Potential Card
 */

export function renderProfileCard(leader, isDestaque) {
  const container = document.getElementById('profile-card-container');
  if (!container) return;

  const html = `
    <div class="flex flex-col bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full justify-between relative overflow-hidden">
      <!-- Top Row: Avatar and Main Info -->
      <div class="flex items-center gap-4 shrink-0">
        <img 
          src="${leader.avatar}" 
          alt="${leader.nome}" 
          class="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
          onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'"
        />
        <div class="min-w-0">
          <h2 class="text-lg font-bold text-mag-dark truncate leading-tight">${leader.nome}</h2>
          <p class="text-xs font-semibold text-slate-500 mt-0.5 leading-snug">${leader.cargo}</p>\n          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">${leader.area}</p>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-slate-100 my-2 shrink-0"></div>
      
      <!-- Bottom Grid: Stats (2 vertical blocks side-by-side) -->
      <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] flex-1">
        <!-- Left Block: Times -->
        <div class="flex flex-col gap-2.5 min-w-0">
          <div class="flex items-start gap-1.5 min-w-0">
            <i data-lucide="clock" class="w-4 h-4 text-sky-900 shrink-0 mt-0.5"></i>
            <div class="min-w-0">
              <p class="text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5 truncate">Tempo de Empresa</p>
              <p class="text-xs text-sky-900 font-bold leading-tight break-words">${leader.tempoEmpresa}</p>
            </div>
          </div>
          <div class="flex items-start gap-1.5 min-w-0">
            <i data-lucide="clock" class="w-4 h-4 text-sky-900 shrink-0 mt-0.5"></i>
            <div class="min-w-0">
              <p class="text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5 truncate">Tempo na Função</p>
              <p class="text-xs text-sky-900 font-bold leading-tight break-words">${leader.tempoFuncao}</p>
            </div>
          </div>
        </div>
        
        <!-- Right Block: Reporting & Team -->
        <div class="flex flex-col gap-2.5 min-w-0">
          <div class="flex items-start gap-1.5 min-w-0">
            <i data-lucide="user-check" class="w-4 h-4 text-sky-900 shrink-0 mt-0.5"></i>
            <div class="min-w-0">
              <p class="text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5 truncate">Reporta Para</p>
              <p class="text-xs text-sky-900 font-bold leading-tight break-words">${leader.reportaPara}</p>
            </div>
          </div>
          <div class="flex items-start gap-1.5 min-w-0">
            <i data-lucide="users" class="w-4 h-4 text-sky-900 shrink-0 mt-0.5"></i>
            <div class="min-w-0">
              <p class="text-[8px] text-slate-400 uppercase font-bold leading-none mb-0.5 truncate">Pessoas Lideradas</p>
              <p class="text-xs text-sky-900 font-bold leading-tight break-words">${leader.pessoasLideradas} colaboradores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

export function renderPotencialCard(leader, isDestaque) {
  const container = document.getElementById('potencial-card-container');
  if (!container) return;

  const circleColor = leader.potencialSigla === 'A' ? 'bg-emerald-500' : 'bg-amber-500';

  const html = `
    <div class="flex flex-col justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full animate-fade-in">
      <div class="flex items-start justify-between">
        <div class="min-w-0 pr-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Potencial</h3>
          <p class="text-sm font-bold text-slate-700 mt-1.5">${leader.potencial}</p>
          <p class="text-xs text-slate-500 leading-snug mt-0.5">${leader.prontidao}</p>
        </div>
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-black ${circleColor} shadow-sm shrink-0">
          ${leader.potencialSigla}
        </div>
      </div>
      
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
        <button id="btn-view-succession" class="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1.5">
          <span>Ver mapeamento de sucessão</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Bind Succession link events
  const btnSuccession = document.getElementById('btn-view-succession');
  if (btnSuccession) {
    btnSuccession.addEventListener('click', () => {
      const tabBtn = document.querySelector('button[data-tab="team"]');
      if (tabBtn) tabBtn.click();
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

export function renderDimensionCard(dimensionId, title, colorClass, indicators, score, showRiscoSensitive, hideHeaderAndFooter = false, worstAlertSeverity = 'Baixo') {
  // Generates SVG Sparkline graph dynamically
  const generateSparkline = (points) => {
    const width = 120;
    const height = 24;
    const padding = 2;
    if (!points || points.length === 0) return '';
    
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min === 0 ? 1 : max - min;
    
    const svgPoints = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((p - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg class="sparkline-svg" width="${width}" height="${height}">
        <polyline
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          points="${svgPoints}"
        />
      </svg>
    `;
  };

  // Determine stroke color and theme based on dimension
  let themeBg, themeText, themeBorder, headerBg, sparklineColor, progressColor;
  if (colorClass === 'blue') {
    themeBg = 'bg-sky-50/50'; themeText = 'text-sky-700'; themeBorder = 'border-sky-100'; headerBg = 'bg-sky-600'; sparklineColor = 'text-sky-500'; progressColor = 'bg-sky-500';
  } else if (colorClass === 'teal') {
    themeBg = 'bg-teal-50/50'; themeText = 'text-teal-700'; themeBorder = 'border-teal-100'; headerBg = 'bg-teal-600'; sparklineColor = 'text-teal-500'; progressColor = 'bg-teal-500';
  } else if (colorClass === 'purple') {
    themeBg = 'bg-purple-50/50'; themeText = 'text-purple-700'; themeBorder = 'border-purple-100'; headerBg = 'bg-purple-600'; sparklineColor = 'text-purple-500'; progressColor = 'bg-purple-500';
  } else if (colorClass === 'orange') {
    themeBg = 'bg-orange-50/50'; themeText = 'text-orange-700'; themeBorder = 'border-orange-100'; headerBg = 'bg-orange-600'; sparklineColor = 'text-orange-500'; progressColor = 'bg-orange-500';
  } else {
    themeBg = 'bg-red-50/50'; themeText = 'text-red-700'; themeBorder = 'border-red-100'; headerBg = 'bg-red-600'; sparklineColor = 'text-red-500'; progressColor = 'bg-red-500';
  }

  // Score formatting
  const isInsuficiente = score === null;
  const displayScore = isInsuficiente ? 'Dados insuficientes' : `${score} <span class="text-[10px] text-slate-400 font-normal">de 100</span>`;

  // Render Indicators rows
  const rowsHtml = indicators.map(ind => {
    let val = ind.valor;
    let statusIcon = '';
    let statusClass = 'text-slate-700 font-bold';

    // Handle governance on risk indicators
    if (dimensionId === 'Risco' && !showRiscoSensitive) {
      if (ind.id === 1) { // Denúncias
        val = 'Acesso restrito';
        statusClass = 'text-slate-400 text-[11px] font-medium italic';
      } else if (ind.id === 20) { // Parecer de RH
        val = 'Acesso restrito';
        statusClass = 'text-slate-400 text-[11px] font-medium italic';
      }
    }

    if (ind.status === 'success') {
      statusIcon = '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0"></i>';
    } else if (ind.status === 'warning') {
      statusIcon = '<i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500 shrink-0"></i>';
    } else if (ind.status === 'danger') {
      statusIcon = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-500 shrink-0"></i>';
    }

    // Render custom graphics inside rows if available
    let valGraphic = '';
    if (ind.id === 4 && val !== 'N/A' && val !== 'Dados insuficientes') { // Resultado de Vendas
      valGraphic = `
        <div class="flex items-center gap-1.5 mt-1">
          <span class="text-[10px] text-slate-400 font-medium">100% da meta</span>
          <div class="flex items-end gap-0.5 h-3.5 pb-0.5">
            <span class="w-1 h-1 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-2 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-3 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-3.5 bg-sky-500 rounded-sm"></span>
          </div>
        </div>
      `;
    } else if (ind.id === 13 && val !== 'N/A') { // Metas corporativas
      const numVal = parseInt(val);
      valGraphic = `
        <div class="w-16 bg-slate-100 rounded-full h-1 mt-1">
          <div class="bg-sky-500 h-1 rounded-full" style="width: ${numVal}%"></div>
        </div>
      `;
    }

    return `
      <div class="flex items-start justify-between py-2 border-b border-slate-100 text-[10px] md:text-[11px] leading-tight gap-2">
        <div class="flex-1 flex min-w-0 pr-1">
          <span class="text-slate-600 font-medium break-words whitespace-normal" title="${ind.nome}">${ind.nome}</span>
        </div>
        <div class="flex items-center gap-1.5 text-right shrink-0">
          <div class="flex flex-col items-end">
            <span class="${statusClass} break-words">${val}</span>
            ${valGraphic}
          </div>
          ${statusIcon}
        </div>
      </div>
    `;
  }).join('');

  // Hardcoded sparkline simulated points
  let sparklinePoints = [70, 72, 75, 78, 85];
  if (dimensionId === 'Resultado') sparklinePoints = [70, 75, 82, 85, 90];
  if (dimensionId === 'Gestao') sparklinePoints = [80, 81, 80, 83, 85];
  if (dimensionId === 'Desenvolvimento') sparklinePoints = [50, 55, 66, 75, 88];
  if (dimensionId === 'Cultura') sparklinePoints = [68, 70, 72, 72, 75];
  if (dimensionId === 'Risco') sparklinePoints = [20, 25, 22, 28, 35];

  const headerHtml = hideHeaderAndFooter ? '' : `
    <!-- Header -->
    <div class="${headerBg} text-white px-3 py-2 md:px-4 md:py-2.5 flex items-center justify-between shadow-sm shrink-0">
      <div class="flex items-center gap-2">
        <h4 class="text-[10px] md:text-xs font-bold uppercase tracking-wider">${title}</h4>
        ${worstAlertSeverity && worstAlertSeverity !== 'Baixo' ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${worstAlertSeverity === 'Crítico' ? 'bg-red-500 text-white border-red-600' : worstAlertSeverity === 'Prioridade' ? 'bg-orange-500 text-white border-orange-600' : 'bg-amber-400 text-slate-900 border-amber-500'}">! Alerta</span>` : ''}
      </div>
      <i data-lucide="${colorClass === 'blue' ? 'trending-up' : colorClass === 'teal' ? 'users' : colorClass === 'purple' ? 'graduation-cap' : colorClass === 'orange' ? 'heart' : 'shield-alert'}" class="w-4 h-4 opacity-80"></i>
    </div>
  `;

  const footerHtml = hideHeaderAndFooter ? '' : `
    <!-- Score Footer -->
    <div class="px-3 py-2.5 md:px-4 md:py-3 border-t border-slate-100 ${themeBg} flex items-center justify-between shrink-0">
      <div>
        <p class="text-[8px] md:text-[9px] uppercase font-bold text-slate-400 leading-none">Índice de ${dimensionId}</p>
        <p class="text-xs md:text-sm font-black mt-1 ${isInsuficiente ? 'text-slate-400 italic font-medium' : themeText}">${displayScore}</p>
      </div>
      <div class="${sparklineColor} opacity-70 pr-1">
        ${isInsuficiente ? '' : generateSparkline(sparklinePoints)}
      </div>
    </div>
  `;

  return `
    <div class="dimension-card flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${hideHeaderAndFooter ? 'h-auto border-none shadow-none' : 'h-[340px]'} animate-fade-in">
      ${headerHtml}
      
      <!-- Indicators List -->
      <div class="flex-1 px-3 py-1.5 md:px-4 md:py-2 overflow-y-auto space-y-0.5">
        ${rowsHtml}
      </div>
      
      ${footerHtml}
    </div>
  `;
}

export function renderDimensionSummaryCard(dimensionId, title, colorClass, score, worstAlertSeverity = 'Baixo') {
  const isInsuficiente = score === null;
  const displayScore = isInsuficiente ? 'Dados insuficientes' : `${score} <span class="text-[10px] text-slate-400 font-normal">de 100</span>`;

  let themeBg, themeText, themeBorder, headerBg, sparklineColor, iconName;
  if (colorClass === 'blue') {
    themeBg = 'bg-sky-50/50'; themeText = 'text-sky-700'; themeBorder = 'border-sky-100'; headerBg = 'bg-sky-600'; sparklineColor = 'text-sky-500'; iconName = 'trending-up';
  } else if (colorClass === 'teal') {
    themeBg = 'bg-teal-50/50'; themeText = 'text-teal-700'; themeBorder = 'border-teal-100'; headerBg = 'bg-teal-600'; sparklineColor = 'text-teal-500'; iconName = 'users';
  } else if (colorClass === 'purple') {
    themeBg = 'bg-purple-50/50'; themeText = 'text-purple-700'; themeBorder = 'border-purple-100'; headerBg = 'bg-purple-600'; sparklineColor = 'text-purple-500'; iconName = 'graduation-cap';
  } else if (colorClass === 'orange') {
    themeBg = 'bg-orange-50/50'; themeText = 'text-orange-700'; themeBorder = 'border-orange-100'; headerBg = 'bg-orange-600'; sparklineColor = 'text-orange-500'; iconName = 'heart';
  } else {
    themeBg = 'bg-red-50/50'; themeText = 'text-red-700'; themeBorder = 'border-red-100'; headerBg = 'bg-red-600'; sparklineColor = 'text-red-500'; iconName = 'shield-alert';
  }

  // Hardcoded sparkline simulated points
  let sparklinePoints = [70, 72, 75, 78, 85];
  if (dimensionId === 'Resultado') sparklinePoints = [70, 75, 82, 85, 90];
  if (dimensionId === 'Gestao') sparklinePoints = [80, 81, 80, 83, 85];
  if (dimensionId === 'Desenvolvimento') sparklinePoints = [50, 55, 66, 75, 88];
  if (dimensionId === 'Cultura') sparklinePoints = [68, 70, 72, 72, 75];
  if (dimensionId === 'Risco') sparklinePoints = [20, 25, 22, 28, 35];

  // Helper for sparklines
  const generateSparkline = (points) => {
    const width = 80;
    const height = 20;
    const padding = 2;
    if (!points || points.length === 0) return '';
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min === 0 ? 1 : max - min;
    const svgPoints = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((p - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');
    return `
      <svg width="${width}" height="${height}">
        <polyline fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${svgPoints}" />
      </svg>
    `;
  };

  return `
    <div class="dimension-summary-card flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 justify-between h-[125px] transition-all hover:translate-y-[-2px] hover:shadow-md cursor-pointer group" data-target-tab="${dimensionId.toLowerCase()}" data-dimension-id="${dimensionId}">
      <div class="flex items-start justify-between">
        <div class="min-w-0 flex-1 pr-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">${title.split('. ')[1] || title}</h4>
            ${worstAlertSeverity !== 'Baixo' ? `<span class="w-1.5 h-1.5 rounded-full ${worstAlertSeverity === 'Crítico' ? 'bg-red-500' : worstAlertSeverity === 'Prioridade' ? 'bg-orange-500' : 'bg-amber-500'} animate-pulse shrink-0"></span>` : ''}
          </div>
          <p class="text-lg font-black mt-1.5 ${isInsuficiente ? 'text-slate-400 italic font-medium' : themeText}">${displayScore}</p>
        </div>
        <div class="p-2 rounded-lg ${themeBg} ${themeText} shrink-0 group-hover:scale-105 transition-transform">
          <i data-lucide="${iconName}" class="w-4 h-4"></i>
        </div>
      </div>
      
      <div class="flex items-end justify-between mt-2 pt-2 border-t border-slate-100">
        <div class="${sparklineColor} opacity-70">
          ${isInsuficiente ? '' : generateSparkline(sparklinePoints)}
        </div>
        <span class="text-[10px] font-bold text-sky-600 group-hover:text-sky-800 flex items-center gap-0.5">
          <span>Ver detalhes</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5 mt-0.5"></i>
        </span>
      </div>
    </div>
  `;
}

export function renderDimensionExpandedCard(dimensionId, title, colorClass, indicators, score, showRiscoSensitive, worstAlertSeverity = 'Baixo') {
  const isInsuficiente = score === null;
  const displayScore = isInsuficiente ? 'Dados insuficientes' : `${score} <span class="text-[10px] text-slate-400 font-normal">de 100</span>`;

  let themeBg, themeText, themeBorder, headerBg, sparklineColor, iconName;
  if (colorClass === 'blue') {
    themeBg = 'bg-sky-50/50'; themeText = 'text-sky-700'; themeBorder = 'border-sky-100'; headerBg = 'bg-sky-600'; sparklineColor = 'text-sky-500'; iconName = 'trending-up';
  } else if (colorClass === 'teal') {
    themeBg = 'bg-teal-50/50'; themeText = 'text-teal-700'; themeBorder = 'border-teal-100'; headerBg = 'bg-teal-600'; sparklineColor = 'text-teal-500'; iconName = 'users';
  } else if (colorClass === 'purple') {
    themeBg = 'bg-purple-50/50'; themeText = 'text-purple-700'; themeBorder = 'border-purple-100'; headerBg = 'bg-purple-600'; sparklineColor = 'text-purple-500'; iconName = 'graduation-cap';
  } else if (colorClass === 'orange') {
    themeBg = 'bg-orange-50/50'; themeText = 'text-orange-700'; themeBorder = 'border-orange-100'; headerBg = 'bg-orange-600'; sparklineColor = 'text-orange-500'; iconName = 'heart';
  } else {
    themeBg = 'bg-red-50/50'; themeText = 'text-red-700'; themeBorder = 'border-red-100'; headerBg = 'bg-red-600'; sparklineColor = 'text-red-500'; iconName = 'shield-alert';
  }

  // Render rows
  const rowsHtml = indicators.map(ind => {
    const isSensitive = ind.id === 20 || ind.id === 1; // Parecer RH, Denúncias
    const isRestricted = isSensitive && !showRiscoSensitive;
    
    if (isRestricted) {
      return `
        <div class="flex items-center justify-between py-2 border-b border-slate-100 text-[10px] md:text-[11px] leading-tight text-slate-400 italic">
          <div class="flex-1 flex gap-1.5 min-w-0 pr-1">
            <span class="font-bold text-slate-300 shrink-0 w-4">${ind.id}</span>
            <span class="truncate">${ind.nome}</span>
          </div>
          <span class="text-[9px] font-semibold text-slate-300">Acesso Restrito</span>
        </div>
      `;
    }

    const val = ind.valor;
    const status = ind.status;
    
    let statusClass = 'font-bold text-slate-700';
    let statusIcon = '';
    
    if (status === 'success') {
      statusClass = 'font-bold text-emerald-600';
      statusIcon = '<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>';
    } else if (status === 'warning') {
      statusClass = 'font-bold text-amber-600';
      statusIcon = '<i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>';
    } else if (status === 'danger') {
      statusClass = 'font-bold text-red-600';
      statusIcon = '<i data-lucide="alert-octagon" class="w-3.5 h-3.5 text-red-500 shrink-0"></i>';
    }

    let valGraphic = '';
    if (ind.id === 4 && val !== 'Dados insuficientes') { // Resultado de vendas
      valGraphic = `
        <div class="flex items-center gap-1 mt-1">
          <span class="text-[10px] text-slate-400 font-medium">100% da meta</span>
          <div class="flex items-end gap-0.5 h-3.5 pb-0.5">
            <span class="w-1 h-1 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-2 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-3 bg-slate-300 rounded-sm"></span>
            <span class="w-1 h-3.5 bg-sky-500 rounded-sm"></span>
          </div>
        </div>
      `;
    } else if (ind.id === 13 && val !== 'N/A') { // Metas corporativas
      const numVal = parseInt(val);
      valGraphic = `
        <div class="w-16 bg-slate-100 rounded-full h-1 mt-1">
          <div class="bg-sky-500 h-1 rounded-full" style="width: ${numVal}%"></div>
        </div>
      `;
    }

    return `
      <div class="flex items-start justify-between py-2 border-b border-slate-100 text-[10px] md:text-[11px] leading-tight gap-2">
        <div class="flex-1 flex min-w-0 pr-1">
          <span class="text-slate-600 font-medium break-words whitespace-normal">${ind.nome}</span>
        </div>
        <div class="flex items-center gap-1.5 text-right shrink-0">
          <div class="flex flex-col items-end">
            <span class="${statusClass} break-words">${val}</span>
            ${valGraphic}
          </div>
          ${statusIcon}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="dimension-expanded-card flex flex-col bg-white rounded-xl border border-sky-400 shadow-md overflow-hidden h-[340px] transition-all animate-fade-in cursor-pointer" data-dimension-id="${dimensionId}">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0 cursor-pointer hover:bg-slate-100/80 transition-colors">
        <div class="min-w-0 flex-1 pr-2">
          <div class="flex items-center gap-2">
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">${title.split('. ')[1] || title}</h4>
            ${worstAlertSeverity && worstAlertSeverity !== 'Baixo' ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${worstAlertSeverity === 'Crítico' ? 'bg-red-500 text-white border-red-600' : worstAlertSeverity === 'Prioridade' ? 'bg-orange-500 text-white border-orange-600' : 'bg-amber-400 text-slate-900 border-amber-500'}">! Alerta</span>` : ''}
          </div>
          <p class="text-base font-black mt-0.5 ${isInsuficiente ? 'text-slate-400 italic font-medium' : themeText}">${displayScore}</p>
        </div>
        <div class="p-2 rounded-lg ${themeBg} ${themeText} shrink-0">
          <i data-lucide="${iconName}" class="w-4 h-4"></i>
        </div>
      </div>
      
      <!-- Indicators List -->
      <div class="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-0.5">
        ${rowsHtml}
      </div>
      
      <!-- Footer Actions -->
      <div class="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 cursor-pointer hover:bg-slate-100/80 transition-colors">
        <button class="modal-navigate-btn text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1" data-dimension-id="${dimensionId}">
          <i data-lucide="external-link" class="w-3 h-3"></i>
          Clique para detalhar
        </button>
        <button class="modal-collapse-btn text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1" data-dimension-id="${dimensionId}">
          <i data-lucide="chevron-up" class="w-3 h-3"></i>
          Recolher
        </button>
      </div>
    </div>
  `;
}
