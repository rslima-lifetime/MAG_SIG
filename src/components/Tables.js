/**
 * Tables Component - Renders Historical Table, Other Indicators, Latest Achievements, and HR Feedback Card
 */

export function renderHistoricalTable(timeline) {
  const container = document.getElementById('historical-table-container');
  if (!container) return;

  const renderStars = (num) => {
    if (num === 0) return '<span class="text-slate-200 text-sm">☆</span>';
    return Array(num).fill('<i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline-block"></i>').join('');
  };

  const html = `
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        HISTÓRICO (LINHA DO TEMPO)
      </h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400">
              <th class="pb-2 font-semibold">Indicador / Ano</th>
              ${timeline.map(t => `<th class="pb-2 font-bold text-center w-16">${t.ano}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 font-medium text-slate-700">
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">Promoções / Méritos</td>
              ${timeline.map(t => `<td class="py-2.5 text-center">${renderStars(t.promocoes)}</td>`).join('')}
            </tr>
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">GPTW</td>
              ${timeline.map(t => `<td class="py-2.5 text-center font-bold">${t.gptw || '-'}</td>`).join('')}
            </tr>
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">Ciclo de Gente</td>
              ${timeline.map(t => `<td class="py-2.5 text-center font-bold text-sky-600">${t.ciclo}</td>`).join('')}
            </tr>
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">Vendas (R$)</td>
              ${timeline.map(t => `<td class="py-2.5 text-center font-bold">${t.vendas}</td>`).join('')}
            </tr>
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">Denúncias</td>
              ${timeline.map(t => `<td class="py-2.5 text-center font-bold ${t.denuncias > 0 ? 'text-red-500' : 'text-slate-400'}">${t.denuncias}</td>`).join('')}
            </tr>
            <tr class="hover:bg-slate-50/50">
              <td class="py-2.5 text-slate-500">Treinamentos</td>
              ${timeline.map(t => `<td class="py-2.5 text-center font-bold">${t.treinamentos}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

export function renderOtherIndicators(team) {
  const container = document.getElementById('other-indicators-container');
  if (!container) return;

  const indicatorsList = [
    { id: 22, name: 'Absenteísmo da equipe', value: team.absenteismo, icon: 'alert-circle' },
    { id: 23, name: 'Movimentação interna', value: `${team.sucessores} promovidos`, icon: 'arrow-left-right' },
    { id: 24, name: 'Tempo médio p/ preencher vagas', value: '28 dias', icon: 'hourglass' },
    { id: 25, name: 'Engajamento nas avaliações', value: team.engajamentoCiclo, icon: 'trending-up', arrow: true },
    { id: 26, name: 'Diversidade da equipe', value: team.diversidade, icon: 'users' },
    { id: 27, name: 'Retenção de talentos-chave', value: team.retencaoTalentos, icon: 'shield-check', arrow: true }
  ];

  const html = `
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        OUTROS INDICADORES
      </h3>
      
      <div class="space-y-2.5">
        ${indicatorsList.map(ind => `
          <div class="flex items-start justify-between text-[10px] md:text-[11px] leading-tight py-1.5 border-b border-slate-50 last:border-0 gap-2">
            <div class="flex-1 flex items-start pr-1 min-w-0">
              <span class="text-slate-600 font-medium break-words whitespace-normal">${ind.name}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0 font-bold text-slate-700 font-bold text-slate-700">
              <span>${ind.value}</span>
              ${ind.arrow ? `<i data-lucide="trending-up" class="w-3.5 h-3.5 text-emerald-500"></i>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

export function renderLatestAchievements(achievements) {
  const container = document.getElementById('latest-achievements-container');
  if (!container) return;

  const html = `
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        ÚLTIMAS CONQUISTAS
      </h3>
      
      <div class="space-y-3">
        ${achievements.map(ach => `
          <div class="flex items-start justify-between text-[10px] md:text-[11px] leading-tight py-1.5 border-b border-slate-50 last:border-0 gap-2">
            <div class="flex-1 flex items-start gap-2 min-w-0 pr-1">
              <div class="w-5 h-5 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                <i data-lucide="${ach.icone}" class="w-3 h-3"></i>
              </div>
              <span class="text-slate-600 font-medium break-words whitespace-normal">${ach.titulo}</span>
            </div>
            <span class="font-bold text-slate-700 shrink-0 mt-0.5">${ach.data}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}

export function renderHRFeedback(parecerRH, showFeedbackSensitive) {
  const container = document.getElementById('hr-feedback-container');
  if (!container) return;

  let contentHtml = '';

  if (showFeedbackSensitive) {
    contentHtml = `
      <div class="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 text-emerald-800 text-xs leading-relaxed">
        ${parecerRH.conteudo}
      </div>
      
      <!-- Autoria Signature -->
      <div class="flex items-center gap-2.5 mt-3">
        <img 
          src="${parecerRH.avatar}" 
          alt="${parecerRH.autor}" 
          class="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
        />
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-slate-800 leading-none">${parecerRH.autor}</p>
          <p class="text-[10px] text-slate-400 font-semibold mt-1 leading-tight">${parecerRH.cargo}<br>${parecerRH.data}</p>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 h-28">
        <i data-lucide="lock" class="w-5 h-5 mb-2 text-slate-300"></i>
        <p class="text-xs font-bold">Acesso Restrito</p>
        <p class="text-[10px] text-slate-400 mt-1 max-w-[200px]">Parecer de RH visível apenas para perfis autorizados (RH Estratégico ou BP).</p>
      </div>
    `;
  }

  const html = `
    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        PARECER DE RH
      </h3>
      
      <div class="flex-1 flex flex-col justify-between">
        ${contentHtml}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}
