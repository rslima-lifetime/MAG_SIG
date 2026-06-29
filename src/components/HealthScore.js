/**
 * HealthScore Component - Renders Leadership Health Score Gauge
 */

export function renderHealthScore(scoreGeral, scoresPorDimensao) {
  const container = document.getElementById('health-score-container');
  if (!container) return;

  // Calculate gauge dash offsets
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scoreGeral / 100) * circumference;

  // Determine main gauge color
  let strokeColor = 'stroke-emerald-500';
  let textColor = 'text-emerald-700';
  let bgCircleColor = 'text-emerald-50';
  if (scoreGeral < 60) {
    strokeColor = 'stroke-red-500';
    textColor = 'text-red-700';
    bgCircleColor = 'text-red-50';
  } else if (scoreGeral < 80) {
    strokeColor = 'stroke-amber-500';
    textColor = 'text-amber-700';
    bgCircleColor = 'text-amber-50';
  }

  // Render mini rings for each dimension
  const miniDimensions = [
    { label: 'Resultados', key: 'Resultado', color: 'text-sky-500', stroke: 'stroke-sky-500' },
    { label: 'Pessoas', key: 'Gestao', color: 'text-teal-500', stroke: 'stroke-teal-500' },
    { label: 'Cultura', key: 'Cultura', color: 'text-orange-500', stroke: 'stroke-orange-500' },
    { label: 'Desenvolvimento', key: 'Desenvolvimento', color: 'text-purple-500', stroke: 'stroke-purple-500' },
    { label: 'Risco', key: 'Risco', color: 'text-red-500', stroke: 'stroke-red-500' }
  ];

  const miniRingsHtml = miniDimensions.map(dim => {
    const dimScore = scoresPorDimensao[dim.key];
    const isInsuficiente = dimScore === null;
    
    // SVG values
    const miniRadius = 22;
    const miniCircumference = 2 * Math.PI * miniRadius;
    const miniOffset = isInsuficiente ? miniCircumference : miniCircumference - (dimScore / 100) * miniCircumference;

    return `
      <div class="flex flex-col items-center group relative cursor-help" title="${dim.label}: ${isInsuficiente ? 'Dados insuficientes' : dimScore + '/100'}">
        <div class="relative w-10 h-10 xl:w-14 xl:h-14 flex items-center justify-center">
          <svg class="transform -rotate-90 w-full h-full" viewBox="0 0 56 56">
            <!-- Background -->
            <circle cx="28" cy="28" r="${miniRadius}" stroke="#e2e8f0" stroke-width="3.5" fill="transparent" />
            <!-- Foreground -->
            ${isInsuficiente ? '' : `
              <circle 
                cx="28" 
                cy="28" 
                r="${miniRadius}" 
                class="radial-progress-circle ${dim.stroke}" 
                stroke-width="3.5" 
                stroke-dasharray="${miniCircumference}" 
                stroke-dashoffset="${miniOffset}" 
                stroke-linecap="round" 
                fill="transparent" 
              />
            `}
          </svg>
          <span class="absolute text-[10px] xl:text-xs font-black ${isInsuficiente ? 'text-slate-300 italic' : 'text-slate-700'}">
            ${isInsuficiente ? '-' : dimScore}
          </span>
        </div>
        <span class="text-[8px] xl:text-[10px] text-slate-400 font-bold uppercase mt-1 xl:mt-1.5 tracking-tight">${dim.label === 'Desenvolvimento' ? 'Desenv.' : dim.label}</span>
      </div>
    `;
  }).join('');

  // Composition Explanation Tooltip
  const compositionTooltip = `
    <div class="absolute hidden group-hover:block bg-slate-800 text-white text-[10px] rounded p-3 shadow-xl border border-slate-700 w-60 z-50 -top-2 left-32 animate-fade-in leading-normal">
      <p class="font-bold mb-1.5 text-xs text-sky-400">Fórmula de Composição do Score:</p>
      <ul class="space-y-1">
        <li>• <b>Resultado</b>: 25% do peso</li>
        <li>• <b>Gestão de Pessoas</b>: 25% do peso</li>
        <li>• <b>Cultura</b>: 20% do peso</li>
        <li>• <b>Desenvolvimento</b>: 15% do peso</li>
        <li>• <b>Risco & Compliance</b>: 15% do peso</li>
      </ul>
      <p class="text-slate-300 border-t border-slate-700 mt-1.5 pt-1.5 italic">* Pesos redistribuídos proporcionalmente se houver dados insuficientes. Se o risco cair abaixo de 50, aplica-se penalidade de -15 pontos.</p>
    </div>
  `;

  const html = `
    <div class="flex flex-col 2xl:flex-row items-center gap-4 2xl:gap-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-full">
      <!-- Main Gauge -->
      <div class="flex items-center gap-3 border-b 2xl:border-b-0 2xl:border-r border-slate-200 pb-3 2xl:pb-0 2xl:pr-5 shrink-0 group relative w-full 2xl:w-auto justify-between 2xl:justify-start">
        <div class="flex items-center gap-3">
          <div class="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            <svg class="transform -rotate-90 w-full h-full" viewBox="0 0 80 80">
              <!-- Background circle -->
              <circle cx="40" cy="40" r="${radius}" stroke="#f1f5f9" stroke-width="6" fill="transparent" />
              <!-- Foreground circle -->
              <circle 
                cx="40" 
                cy="40" 
                r="${radius}" 
                class="radial-progress-circle ${strokeColor}" 
                stroke-width="6" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${offset}" 
                stroke-linecap="round" 
                fill="transparent" 
              />
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-xl sm:text-2xl font-black ${textColor} leading-none">${scoreGeral}</span>
              <span class="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase leading-none mt-0.5">de 100</span>
            </div>
          </div>
          
          <div class="flex flex-col">
            <div class="flex items-center gap-1 cursor-pointer">
              <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none">Health Score</h3>
              <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400 hover:text-slate-600"></i>
            </div>
            <p class="text-[9px] sm:text-[10px] text-slate-400 font-semibold mt-1 leading-tight">Índice de Saúde<br>da Liderança</p>
          </div>
        </div>
        
        ${compositionTooltip}
      </div>
      
      <!-- Mini Rings Grid -->
      <div class="flex-1 flex justify-between 2xl:justify-around gap-2 w-full pt-2 2xl:pt-0">
        ${miniRingsHtml}
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();
}
