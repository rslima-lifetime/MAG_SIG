/**
 * SIG² - Workspace de Detalhamento de Dimensões (DimensionWorkspace Component)
 * Fornece uma visualização analítica profunda dividida em duas colunas:
 * - Esquerda: Lista interativa de indicadores da dimensão.
 * - Direita: Painel com gráficos, tabelas e planos de recomendação de ação.
 */

import { renderRetentionAlertList, showAlertDetailModal } from './RetentionRadar.js';

/**
 * Generates an SVG bar chart for sales/metrics trends
 */
function renderSVGBarChart(data, colorHex) {
  const width = 500;
  const height = 150;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => d.val), 10);
  const barWidth = (chartWidth / data.length) * 0.6;
  const spacing = (chartWidth / data.length) * 0.4;

  const bars = data.map((d, i) => {
    const x = paddingLeft + i * (barWidth + spacing) + spacing / 2;
    const barHeight = (d.val / maxVal) * chartHeight;
    const y = paddingTop + chartHeight - barHeight;

    return `
      <g class="group">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${colorHex}" rx="3" class="transition-all duration-300 opacity-90 hover:opacity-100 cursor-pointer"></rect>
        <text x="${x + barWidth / 2}" y="${y - 4}" text-anchor="middle" font-size="9" font-weight="bold" fill="#475569" class="opacity-0 group-hover:opacity-100 transition-opacity">${d.val}</text>
        <text x="${x + barWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="9" font-weight="semibold" fill="#94a3b8">${d.label}</text>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-full">
      <!-- Grid lines -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${width - paddingRight}" y2="${paddingTop}" stroke="#f1f5f9" stroke-width="1"></line>
      <line x1="${paddingLeft}" y1="${paddingTop + chartHeight / 2}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight / 2}" stroke="#f1f5f9" stroke-width="1"></line>
      <line x1="${paddingLeft}" y1="${paddingTop + chartHeight}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight}" stroke="#cbd5e1" stroke-width="1.5"></line>
      
      <!-- Axis labels -->
      <text x="${paddingLeft - 5}" y="${paddingTop + 4}" text-anchor="end" font-size="8" fill="#94a3b8" font-weight="bold">${maxVal}</text>
      <text x="${paddingLeft - 5}" y="${paddingTop + chartHeight / 2 + 3}" text-anchor="end" font-size="8" fill="#94a3b8" font-weight="bold">${Math.round(maxVal / 2)}</text>
      <text x="${paddingLeft - 5}" y="${paddingTop + chartHeight + 3}" text-anchor="end" font-size="8" fill="#94a3b8" font-weight="bold">0</text>

      ${bars}
    </svg>
  `;
}

/**
 * Returns mock sub-details for a selected indicator
 */
function getIndicatorSubDetails(indId, leader, team, journey) {
  const teamMembers = team.liderados || [
    { nome: 'Carlos Silva', cargo: 'Consultor de Vendas Sr', performance: '102%', status: 'success' },
    { nome: 'Patricia Alves', cargo: 'Consultor de Vendas Pl', performance: '95%', status: 'success' },
    { nome: 'Roberto Melo', cargo: 'Consultor de Vendas Pl', performance: '82%', status: 'warning' },
    { nome: 'Juliana Costa', cargo: 'Consultor de Vendas Jr', performance: '68%', status: 'danger' }
  ];

  // 1. RESULTADOS DO NEGÓCIO
  if (indId === 4) { // Resultado de vendas
    return {
      title: 'Resultado de Vendas (Acumulado no Ano)',
      value: team.turnover === '8%' ? 'R$ 28,4 MM' : team.turnover === '4%' ? 'R$ 42,1 MM' : 'R$ 15,2 MM',
      metric: 'Percentual de atingimento da meta de vendas acumulada no ano.',
      source: 'CRM Vendas / Salesforce',
      chartHtml: renderSVGBarChart([
        { label: 'Jan', val: 78 }, { label: 'Fev', val: 82 }, { label: 'Mar', val: 88 },
        { label: 'Abr', val: 95 }, { label: 'Mai', val: 102 }, { label: 'Jun', val: 104 },
        { label: 'Jul', val: 98 }, { label: 'Ago', val: 101 }, { label: 'Set', val: 105 },
        { label: 'Out', val: 110 }, { label: 'Nov', val: 115 }, { label: 'Dez', val: 120 }
      ], '#0284C7'),
      tableTitle: 'Vendas e Desempenho do Time (Membros)',
      tableHeaders: ['Nome', 'Cargo', 'Atingimento da Meta', 'Status'],
      tableRows: teamMembers,
      diagnostic: 'O time comercial apresenta um excelente ritmo de aceleração de vendas a partir do segundo trimestre. A entrada de novos produtos na carteira de seguros impulsionou o atingimento geral.',
      actionPlan: [
        'Manter rotina semanal de forecast de vendas para o fechamento do trimestre.',
        'Desenvolver plano de recuperação individual para membros da equipe com atingimento abaixo de 85%.',
        'Alocar mentoria dos consultores sêniores para apoiar os consultores juniores no fechamento de contas.'
      ]
    };
  }

  if (indId === 13) { // Metas individuais
    return {
      title: 'Atingimento de Metas Individuais (KPOs)',
      value: team.engajamentoCiclo || '82%',
      metric: 'Média de atingimento dos objetivos corporativos individuais acordados no SuccessFactors.',
      source: 'SuccessFactors / Gente & Gestão',
      chartHtml: `
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>Metas Financeiras (Receita e Margem)</span>
              <span>85%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-sky-500 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>Metas de Processos (Qualidade e Conformidade)</span>
              <span>92%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-teal-500 h-2 rounded-full" style="width: 92%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>Projetos e Inovação</span>
              <span>74%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
              <div class="bg-purple-50 h-2 rounded-full bg-purple-500" style="width: 74%"></div>
            </div>
          </div>
        </div>
      `,
      tableTitle: 'Metas Estratégicas Ativas',
      tableHeaders: ['Nome da Meta', 'Peso', 'Atingimento Atual', 'Status'],
      tableRows: [
        { nome: 'Eficiência de Custos', cargo: '30%', performance: '90%', status: 'success' },
        { nome: 'Satisfação do Cliente (NPS)', cargo: '30%', performance: '82%', status: 'warning' },
        { nome: 'Implementação de Novos Processos', cargo: '20%', performance: '95%', status: 'success' },
        { nome: 'Liderança de Projetos de TI', cargo: '20%', performance: '60%', status: 'danger' }
      ],
      diagnostic: 'O principal detrator do atingimento das metas corporativas está na dimensão de Projetos, que sofreu atrasos devido ao remanejamento de pessoal na equipe no início do ano.',
      actionPlan: [
        'Repactuar prazos de entregas de projetos-chave no SuccessFactors.',
        'Reforçar foco nas metas financeiras no fechamento do período de referência.',
        'Estabelecer ritos quinzenais de monitoramento de KPOs com o report direto.'
      ]
    };
  }

  // 2. GESTÃO DE PESSOAS
  if (indId === 8) { // Turnover
    const isHigh = parseFloat((team.turnover || '0%').replace('%', '')) >= 12;
    return {
      title: 'Taxa de Turnover (Rotatividade)',
      value: team.turnover || '8%',
      metric: 'Taxa de rotatividade acumulada no ano. Indica o percentual de saídas voluntárias e involuntárias em relação ao headcount total.',
      source: 'ADP / Sênior',
      chartHtml: renderSVGBarChart([
        { label: 'Jan', val: 0.5 }, { label: 'Fev', val: 0.8 }, { label: 'Mar', val: 1.2 },
        { label: 'Abr', val: 0.9 }, { label: 'Mai', val: 1.5 }, { label: 'Jun', val: 1.1 },
        { label: 'Jul', val: 0.8 }, { label: 'Ago', val: 1.3 }, { label: 'Set', val: 0.5 },
        { label: 'Out', val: 1.0 }, { label: 'Nov', val: 2.1 }, { label: 'Dez', val: 1.5 }
      ], isHigh ? '#EF4444' : '#0D9488'),
      tableTitle: 'Histórico de Saídas Recentes',
      tableHeaders: ['Colaborador', 'Cargo', 'Tipo de Desligamento', 'Tempo de Casa'],
      tableRows: [
        { nome: 'Marcos Santos', cargo: 'Consultor de Vendas', performance: 'Voluntário (Outro Emprego)', status: 'warning' },
        { nome: 'Renata Souza', cargo: 'Assistente Administrativo', performance: 'Voluntário (Pessoal)', status: 'warning' },
        { nome: 'Felipe Abreu', cargo: 'Consultor de Vendas', performance: 'Involuntário (Performance)', status: 'success' }
      ],
      diagnostic: isHigh 
        ? 'A taxa de rotatividade da equipe está em estado crítico (acima de 12%). A maior concentração de saídas ocorre nos primeiros 12 meses de empresa, indicando possíveis lacunas na integração (onboarding) ou atrito na liderança direta.'
        : 'O turnover da equipe está dentro do patamar considerado saudável (abaixo de 10%). A liderança tem demonstrado boa capacidade de retenção dos talentos essenciais.',
      actionPlan: [
        'Realizar rodada de entrevistas de retenção (stay interviews) com colaboradores de alto potencial com mais de 8 meses de casa.',
        'Revisar o processo de onboarding do time com o time de Treinamento.',
        'Desenvolver workshops de liderança humanizada focado em gestão de clima.'
      ]
    };
  }

  if (indId === 12) { // Sucessores
    return {
      title: 'Mapeamento de Sucessão da Cadeira',
      value: `${team.sucessores || 2} Sucessor(es)`,
      metric: 'Quantidade de colaboradores mapeados na organização com perfil e prontidão para assumir a cadeira do gestor.',
      source: 'Cornerstone / Gente & Gestão',
      chartHtml: `
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
            <span class="text-xs text-emerald-800 font-bold block">Prontidão Imediata</span>
            <span class="text-2xl font-black text-emerald-600 mt-1 block">1</span>
          </div>
          <div class="bg-amber-50 border border-amber-100 p-3 rounded-lg">
            <span class="text-xs text-amber-800 font-bold block">Em até 1 Ano</span>
            <span class="text-2xl font-black text-amber-600 mt-1 block">1</span>
          </div>
          <div class="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <span class="text-xs text-slate-800 font-bold block">Em 2 Anos+</span>
            <span class="text-2xl font-black text-slate-500 mt-1 block">1</span>
          </div>
        </div>
      `,
      tableTitle: 'Pipeline de Sucessores Mapeados',
      tableHeaders: ['Nome do Sucessor', 'Cargo Atual', 'Prontidão Mapeada', 'Risco de Perda'],
      tableRows: [
        { nome: 'Ana Souza', cargo: 'Coordenadora Comercial', performance: 'Prontidão Imediata', status: 'success' },
        { nome: 'Marcos Dias', cargo: 'Consultor de Vendas Sr', performance: 'Prontidão em 1 ano', status: 'warning' },
        { nome: 'Fernanda Lima', cargo: 'Consultor de Vendas Pl', performance: 'Prontidão em 2 anos', status: 'success' }
      ],
      diagnostic: 'O plano de sucessão está estruturado, mas apresenta alta dependência de um único candidato com prontidão imediata. Caso esse profissional saia ou seja promovido para outra diretoria, a cadeira ficará desprotegida.',
      actionPlan: [
        'Acelerar plano de desenvolvimento individual (PDI) dos sucessores de médio prazo.',
        'Incluir os sucessores em reuniões estratégicas do gestor atual como job shadowing.',
        'Avaliar pacote de retenção ou reconhecimento para o sucessor com prontidão imediata.'
      ]
    };
  }

  // 3. DESENVOLVIMENTO
  if (indId === 10) { // Treinamentos obrigatórios
    return {
      title: 'Aderência a Treinamentos Obrigatórios',
      value: team.engajamentoCiclo === '72%' ? '72%' : '94%',
      metric: 'Percentual de conclusão das trilhas regulatórias e obrigatórias vigentes na companhia (ex: LGPD, Prevenção a Fraudes).',
      source: 'MAG Universidade / Compliance',
      chartHtml: `
        <div class="flex items-center gap-6">
          <div class="relative w-20 h-20 shrink-0">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-slate-100" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-purple-600 transition-all duration-800" stroke-width="3" stroke-dasharray="${team.engajamentoCiclo === '72%' ? '72' : '94'}, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-sm font-black text-slate-800">${team.engajamentoCiclo === '72%' ? '72%' : '94%'}</span>
            </div>
          </div>
          <div class="text-xs text-slate-500 space-y-1">
            <p>• Meta corporativa: **100% de conclusão**</p>
            <p>• Pendências na equipe: **${team.engajamentoCiclo === '72%' ? '6 colaboradores' : '1 colaborador'}**</p>
            <p>• Status: **${team.engajamentoCiclo === '72%' ? 'Atenção' : 'Excelente'}**</p>
          </div>
        </div>
      `,
      tableTitle: 'Status de Conclusão por Colaborador',
      tableHeaders: ['Nome', 'Área', 'Trilha Obrigatória', 'Status'],
      tableRows: [
        { nome: 'Carlos Silva', cargo: 'Comercial', performance: 'Concluído', status: 'success' },
        { nome: 'Patricia Alves', cargo: 'Comercial', performance: 'Concluído', status: 'success' },
        { nome: 'Roberto Melo', cargo: 'Comercial', performance: 'Pendente (Atrasado)', status: 'danger' },
        { nome: 'Juliana Costa', cargo: 'Comercial', performance: 'Concluído', status: 'success' }
      ],
      diagnostic: 'A equipe apresenta uma excelente taxa de engajamento em treinamentos regulatórios, com apenas uma pendência pendente de conclusão no módulo de Cibersegurança.',
      actionPlan: [
        'Cobrar formalmente a conclusão do treinamento do colaborador pendente até o final da semana.',
        'Bloquear agenda dos colaboradores pendentes para foco exclusivo no treinamento por 2 horas.',
        'Incluir a conclusão de treinamentos obrigatórios como critério para avaliação de performance anual.'
      ]
    };
  }

  // 4. CULTURA
  if (indId === 3) { // GPTW
    return {
      title: 'Índice de Clima GPTW (Histórico)',
      value: team.climaTime || '87/100',
      metric: 'Pontuação obtida na avaliação anual de clima organizacional aplicada à equipe liderada.',
      source: 'Portal GPTW',
      chartHtml: renderSVGBarChart([
        { label: '2023', val: 78 }, { label: '2024', val: 82 }, { label: '2025 (Atual)', val: parseInt(team.climaTime || '87') }
      ], '#F97316'),
      tableTitle: 'Notas dos Pilares do Clima',
      tableHeaders: ['Pilar do Clima', 'Definição', 'Score da Equipe', 'Status'],
      tableRows: [
        { nome: 'Credibilidade', cargo: 'Confiança na liderança e diretrizes', performance: '88/100', status: 'success' },
        { nome: 'Respeito', cargo: 'Tratamento justo e desenvolvimento', performance: '85/100', status: 'success' },
        { nome: 'Imparcialidade', cargo: 'Ausência de favoritismo e transparência', performance: '72/100', status: 'warning' },
        { nome: 'Orgulho', cargo: 'Sensação de pertencimento e valor do trabalho', performance: '92/100', status: 'success' }
      ],
      diagnostic: 'A nota de clima geral é excelente (87/100). No entanto, o pilar de Imparcialidade acusa um desvio importante em relação aos demais. Comentários qualitativos apontam a percepção de falta de transparência em promoções recentes.',
      actionPlan: [
        'Realizar um feedback coletivo explicando abertamente os critérios de promoção e méritos da área.',
        'Aumentar a transparência nas decisões estratégicas da regional.',
        'Elaborar plano de ação de clima focado nos pontos de insatisfação identificados.'
      ]
    };
  }

  // 5. RISCO & COMPLIANCE
  if (indId === 1) { // Denúncias
    return {
      title: 'Registro de Denúncias no Canal de Ética',
      value: team.pendenciasGestao >= 5 ? '1 caso procedente' : '0 casos procedentes',
      metric: 'Número de denúncias procedentes ou sob investigação registradas no Canal de Ética envolvendo a equipe.',
      source: 'Canal de Ética / Compliance',
      chartHtml: `
        <div class="p-4 bg-red-50 border border-red-100 rounded-lg text-slate-700 flex items-start gap-3">
          <i data-lucide="shield-alert" class="w-5 h-5 text-red-600 shrink-0 mt-0.5"></i>
          <div class="text-xs">
            <h4 class="font-bold text-red-900">Política de Risco & Confidencialidade</h4>
            <p class="text-red-700 mt-1">Informações detalhadas sobre investigações do Canal de Ética são altamente restritas. Detalhes específicos de nomes, processos e depoimentos são visíveis apenas para a Diretoria e a Business Partner de RH autorizada.</p>
          </div>
        </div>
      `,
      tableTitle: 'Registro de Auditoria de Riscos da Área',
      tableHeaders: ['ID do Processo', 'Categoria', 'Status', 'Atualização'],
      tableRows: [
        { nome: 'PROC-2025-098', cargo: 'Auditoria de Processos', performance: 'Concluído (Conforme)', status: 'success' },
        { nome: 'PROC-2025-104', cargo: 'Conformidade de Alçadas', performance: 'Concluído (Conforme)', status: 'success' },
        { nome: 'DEN-2025-004', cargo: 'Canal de Ética (Confidencial)', performance: 'Em Investigação', status: 'danger' }
      ],
      diagnostic: 'Existe um caso atípico em processo de investigação pelo comitê de conduta da MAG. A liderança foi orientada a manter postura neutra e colaborar com o fornecimento de logs e registros solicitados pelo compliance.',
      actionPlan: [
        'Apoiar comitê de conduta da MAG com o envio de documentações dentro do prazo.',
        'Reforçar código de ética da MAG na reunião geral trimestral da regional.',
        'Mapear pontos de controle interno e alçadas de aprovação financeira para evitar desvios.'
      ]
    };
  }

  // DEFAULT / FALLBACK FOR ANY OTHER INDICATOR
  return {
    title: `Indicador: ${indId}`,
    value: 'Consultar Valor',
    metric: 'Definição padrão do indicador para acompanhamento de metas institucionais.',
    source: 'BI Corporativo',
    chartHtml: renderSVGBarChart([
      { label: 'Q1', val: 78 }, { label: 'Q2', val: 82 }, { label: 'Q3', val: 80 }, { label: 'Q4', val: 85 }
    ], '#0284C7'),
    tableTitle: 'Detalhamento Trimestral de Dados',
    tableHeaders: ['Período', 'Referência', 'Valor Obtido', 'Status'],
    tableRows: [
      { nome: 'Q1 2025', cargo: 'Meta: 80%', performance: '78%', status: 'warning' },
      { nome: 'Q2 2025', cargo: 'Meta: 80%', performance: '82%', status: 'success' },
      { nome: 'Q3 2025', cargo: 'Meta: 80%', performance: '80%', status: 'success' },
      { nome: 'Q4 2025', cargo: 'Meta: 80%', performance: '85%', status: 'success' }
    ],
    diagnostic: 'O indicador mantém estabilidade com desvio padrão mínimo em relação à meta corporativa estabelecida para o ano fiscal vigente.',
    actionPlan: [
      'Manter rituais de acompanhamento e monitoramento bimestrais.',
      'Documentar boas práticas de gestão de processos para compartilhamento com outros líderes.',
      'Identificar gargalos pontuais no final de cada trimestre.'
    ]
  };
}

/**
 * Renders the complete, split-panel workspace
 */
export function renderDimensionWorkspace(container, dimensionKey, state, onIndicatorSelect) {
  const leader = state.leaders.find(l => l.id === state.selectedLeaderId) || state.leaders[0];
  const team = state.team[state.selectedLeaderId] || {};
  const journey = state.journey.leaders[state.selectedLeaderId] || { timeline: [], conquistas: [] };

  const rawIndicators = state.indicators[dimensionKey] || [];
  
  // Custom helper inside component
  const mapIndicatorsValues = (inds, teamData, leaderData, journeyData) => {
    return inds.map(ind => {
      let val = 'N/A';
      let status = 'success';
      
      if (ind.id === 4) { // Vendas
        val = teamData.turnover === '8%' ? 'R$ 28,4 MM' : teamData.turnover === '4%' ? 'R$ 42,1 MM' : 'R$ 15,2 MM';
        status = teamData.turnover === '14%' || teamData.turnover === '18%' ? 'warning' : 'success';
      } else if (ind.id === 13) { // Metas individuais
        val = teamData.engajamentoCiclo || '82%';
        const numVal = parseInt(val);
        status = numVal >= 90 ? 'success' : numVal >= 80 ? 'warning' : 'danger';
      } else if (ind.id === 6) { // Performance treinandos
        val = teamData.performanceTreinandos || 'N/A';
        status = val !== 'N/A' && parseInt(val) >= 85 ? 'success' : 'warning';
      } else if (ind.id === 14) { // Projetos-chave
        val = teamData.turnover === '8%' ? '4 ativas' : teamData.turnover === '4%' ? '6 ativas' : '2 ativas';
        status = 'success';
      } else if (ind.id === 18) { // Premiações
        val = teamData.turnover === '8%' || teamData.turnover === '4%' ? 'Galo de Ouro' : 'Nenhuma';
        status = 'success';
      } else if (ind.id === 2) { // Ciclo de Gente
        val = leaderData.potencial;
        status = 'success';
      } else if (ind.id === 3) { // GPTW
        val = teamData.climaTime || 'N/A';
        status = val !== 'N/A' && parseInt(val) >= 85 ? 'success' : 'warning';
      } else if (ind.id === 8) { // Turnover
        val = teamData.turnover || 'N/A';
        const numVal = parseFloat(val.replace('%', ''));
        status = numVal < 10 ? 'success' : numVal < 12 ? 'warning' : 'danger';
      } else if (ind.id === 12) { // Sucessores
        val = String(teamData.sucessores || 0);
        status = teamData.sucessores >= 2 ? 'success' : 'warning';
      } else if (ind.id === 10) { // Treinamentos obrigatórios
        val = teamData.engajamentoCiclo === '72%' ? '72%' : '94%';
        const numVal = parseFloat(val.replace('%', ''));
        status = numVal >= 90 ? 'success' : numVal >= 80 ? 'warning' : 'danger';
      } else if (ind.id === 20) { // Parecer de RH
        val = 'Favorável';
        status = 'success';
      } else if (ind.id === 1) { // Denúncias
        val = teamData.pendenciasGestao >= 5 ? '1 caso' : '0 casos';
        status = teamData.pendenciasGestao >= 5 ? 'danger' : 'success';
      } else if (ind.id === 9) { // Aprovações legais
        val = teamData.engajamentoCiclo || '90%';
        status = 'success';
      } else if (ind.id === 21) { // Gestão de pessoas
        val = teamData.gestaoPonto || '92%';
        status = 'success';
      }

      return { ...ind, valor: val, status: status };
    });
  };

  const processedIndicators = mapIndicatorsValues(rawIndicators, team, leader, journey);
  
  // Set default selected indicator if not already set or not in current dimension
  let selectedId = state.selectedIndicatorId;
  const exists = processedIndicators.some(i => i.id === selectedId);
  if (!exists && processedIndicators.length > 0) {
    selectedId = processedIndicators[0].id;
    state.selectedIndicatorId = selectedId; // update state silently
  }

  const selectedInd = processedIndicators.find(i => i.id === selectedId) || processedIndicators[0];
  const details = getIndicatorSubDetails(selectedId, leader, team, journey);

  // Setup dimension details layout styling
  let colorClass = 'sky', colorHex = '#0284C7';
  if (dimensionKey === 'Gestao') { colorClass = 'teal'; colorHex = '#0D9488'; }
  else if (dimensionKey === 'Desenvolvimento') { colorClass = 'purple'; colorHex = '#7C3AED'; }
  else if (dimensionKey === 'Cultura') { colorClass = 'orange'; colorHex = '#EA580C'; }
  else if (dimensionKey === 'Risco') { colorClass = 'red'; colorHex = '#DC2626'; }

  const dimensionName = dimensionKey === 'Gestao' ? 'Gestão de Pessoas' : dimensionKey === 'Desenvolvimento' ? 'Desenvolvimento' : dimensionKey === 'Cultura' ? 'Cultura' : dimensionKey === 'Risco' ? 'Risco & Compliance' : 'Resultados do Negócio';
  const score = leader.scoresPorDimensao[dimensionKey];

  // Get alerts for the pillar
  const pillarAlerts = state.alerts.filter(a => a.leaderId === state.selectedLeaderId && a.status === 'Ativo' && a.pillar === dimensionName);
  const worstSeverity = pillarAlerts.length > 0 ? (pillarAlerts.some(a => a.severity === 'Crítico') ? 'Crítico' : pillarAlerts.some(a => a.severity === 'Prioridade') ? 'Prioridade' : 'Atenção') : 'Baixo';
  
  let sectionTitle = 'Sinais de Atenção';
  if (dimensionKey === 'Gestao') sectionTitle = 'Sinais de Retenção';
  else if (dimensionKey === 'Cultura') sectionTitle = 'Sinais de Clima e Engajamento';
  else if (dimensionKey === 'Risco') sectionTitle = 'Sinais Sensíveis e Governança';
  else if (dimensionKey === 'Desenvolvimento') sectionTitle = 'Sinais de Desenvolvimento';

  const alertsListHtml = renderRetentionAlertList(pillarAlerts, dimensionName, state.selectedProfile);
  
  const alertsBlockHtml = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-6">
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-between">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="bell" class="w-4 h-4 text-${colorClass}-500"></i>
          <span>${sectionTitle}</span>
        </h3>
        ${worstSeverity !== 'Baixo' ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${worstSeverity === 'Crítico' ? 'bg-red-100 text-red-800 border-red-200' : worstSeverity === 'Prioridade' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-amber-100 text-amber-800 border-amber-200'}">${worstSeverity}</span>` : ''}
      </div>
      <div class="p-4 bg-slate-50/20 text-slate-700">
        ${alertsListHtml}
      </div>
    </div>
  `;

  // Left indicators list HTML
  const leftListHtml = processedIndicators.map(ind => {
    const isSelected = ind.id === selectedId;
    const borderClass = isSelected ? `border-l-4 border-${colorClass}-500 bg-${colorClass}-50/30` : 'hover:bg-slate-50';
    const textClass = isSelected ? `text-${colorClass}-700 font-bold` : 'text-slate-700 font-medium';
    
    let statusIcon = '';
    if (ind.status === 'success') {
      statusIcon = '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>';
    } else if (ind.status === 'warning') {
      statusIcon = '<i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i>';
    } else if (ind.status === 'danger') {
      statusIcon = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-500"></i>';
    }

    return `
      <button class="indicator-tab-btn text-left w-full p-4 border-b border-slate-100 transition-all ${borderClass} flex items-center justify-between" data-indicator-id="${ind.id}">
        <div class="min-w-0 pr-2">
          <span class="text-xs md:text-sm ${textClass} block truncate mt-0.5">${ind.nome}</span>
          <span class="text-xs font-semibold text-slate-500 mt-1 block">${ind.valor}</span>
        </div>
        <div class="shrink-0 flex items-center">
          ${statusIcon}
        </div>
      </button>
    `;
  }).join('');

  // Right Table Rows HTML
  const tableRowsHtml = details.tableRows.map(row => {
    let rowIcon = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>';
    let rowColor = 'text-slate-700';
    if (row.status === 'warning') {
      rowIcon = '<i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-500"></i>';
      rowColor = 'text-slate-800 font-semibold';
    } else if (row.status === 'danger') {
      rowIcon = '<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-red-500"></i>';
      rowColor = 'text-red-700 font-bold';
    }

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
        <td class="px-4 py-2.5 text-xs font-semibold text-slate-800">${row.nome}</td>
        <td class="px-4 py-2.5 text-xs text-slate-600">${row.cargo}</td>
        <td class="px-4 py-2.5 text-xs ${rowColor}">${row.performance}</td>
        <td class="px-4 py-2.5 text-xs text-center shrink-0">
          <div class="inline-flex items-center justify-center p-1 bg-slate-100/50 rounded-full">
            ${rowIcon}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Right Table Header HTML
  const tableHeadersHtml = details.tableHeaders.map((th, i) => {
    return `<th class="px-4 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider ${i === 3 ? 'text-center' : ''}">${th}</th>`;
  }).join('');

  // Action plan list
  const actionPlanHtml = details.actionPlan.map(act => {
    return `
      <li class="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
        <i data-lucide="arrow-right-circle" class="w-4 h-4 text-${colorClass}-500 shrink-0 mt-0.5"></i>
        <span>${act}</span>
      </li>
    `;
  }).join('');

  container.innerHTML = `
    <div class="flex flex-col gap-6 w-full animate-fade-in">
      <!-- Breadcrumbs and back button -->
      <div class="flex items-center justify-between print-hide">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <button id="workspace-back-btn" class="hover:text-sky-600 transition flex items-center gap-1">
            <i data-lucide="home" class="w-3.5 h-3.5"></i> Visão Geral
          </button>
          <span>/</span>
          <span class="text-slate-600 uppercase tracking-wider font-bold">${dimensionName}</span>
        </div>
        <button id="workspace-back-top-btn" class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Voltar ao Dashboard
        </button>
      </div>

      <!-- Dashboard Header -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span class="text-xs uppercase text-slate-400 font-bold tracking-widest block">Painel Detalhado</span>
          <h2 class="text-xl font-black text-slate-800 mt-1 block">${dimensionName}</h2>
          <div class="flex items-center gap-2 mt-2">
            <div class="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shadow-sm">
              <img src="${leader.avatar}" class="w-full h-full object-cover" />
            </div>
            <span class="text-xs font-bold text-slate-600">${leader.nome}</span>
            <span class="text-[10px] bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded font-bold">${leader.cargo}</span>
          </div>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <div class="text-right">
            <span class="text-xs text-slate-400 font-bold block">Score da Dimensão</span>
            <span class="text-2xl font-black text-${colorClass}-600 mt-0.5 block">${score !== null ? score + '/100' : 'N/A'}</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-${colorClass}-50 flex items-center justify-center text-${colorClass}-600">
            <i data-lucide="${dimensionKey === 'Resultado' ? 'trending-up' : dimensionKey === 'Gestao' ? 'users' : dimensionKey === 'Desenvolvimento' ? 'graduation-cap' : dimensionKey === 'Cultura' ? 'heart' : 'shield-alert'}" class="w-6 h-6"></i>
          </div>
        </div>
      </div>

      <!-- Main Workspace Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Panel: Interactive Indicators List -->
        <div class="lg:col-span-4 flex flex-col">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="list" class="w-4 h-4 text-${colorClass}-500"></i>
                <span>Selecione um Indicador</span>
              </h3>
            </div>
            <div class="flex flex-col max-h-[500px] overflow-y-auto">
              ${leftListHtml}
            </div>
          </div>
          
          <!-- Alerts Block -->
          ${alertsBlockHtml}
        </div>

        <!-- Right Panel: Deep-Dive Workspace -->
        <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px] animate-fade-in" id="indicator-detail-panel">
          
          <!-- Indicator Deep-dive Header -->
          <div class="p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <h3 class="text-base font-black text-slate-800 mt-1">${details.title}</h3>
                <p class="text-xs text-slate-400 mt-1 font-semibold">Fonte de Dados: <span class="text-slate-600 font-bold">${details.source}</span></p>
              </div>
              <div class="text-left md:text-right shrink-0">
                <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Valor Atual</span>
                <span class="text-xl font-black text-slate-800 mt-0.5 block">${details.value}</span>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-white border border-slate-200/60 rounded-xl text-xs text-slate-500 leading-relaxed shadow-sm">
              <span class="font-bold text-slate-600 block mb-0.5">Regra / Como é medido:</span>
              ${details.metric}
            </div>
          </div>

          <!-- Main Detail Contents -->
          <div class="p-6 space-y-6 flex-1">
            
            <!-- Graphic / Chart Area -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-${colorClass}-500"></i>
                <span>Comportamento Histórico / Tendência</span>
              </h4>
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center min-h-[160px]">
                <div class="w-full max-w-lg">
                  ${details.chartHtml}
                </div>
              </div>
            </div>

            <!-- Grid: Breakdowns and Decision support -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Left: Sub-Metrics Table -->
              <div class="space-y-3">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <i data-lucide="database" class="w-3.5 h-3.5 text-${colorClass}-500"></i>
                  <span>${details.tableTitle}</span>
                </h4>
                <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div class="overflow-x-auto max-h-[220px] overflow-y-auto">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="bg-slate-50 border-b border-slate-100">
                          ${tableHeadersHtml}
                        </tr>
                      </thead>
                      <tbody>
                        ${tableRowsHtml}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Right: Diagnosis & Plan of Action -->
              <div class="space-y-4">
                
                <!-- Diagnosis -->
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <i data-lucide="activity" class="w-3.5 h-3.5 text-${colorClass}-500"></i>
                    <span>Diagnóstico da Liderança</span>
                  </h4>
                  <div class="p-4 bg-${colorClass}-50/30 rounded-xl border border-${colorClass}-100/50 text-xs text-slate-600 leading-relaxed shadow-sm">
                    ${details.diagnostic}
                  </div>
                </div>

                <!-- Plan of Action -->
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <i data-lucide="check-square" class="w-3.5 h-3.5 text-${colorClass}-500"></i>
                    <span>Recomendações de Ação</span>
                  </h4>
                  <ul class="space-y-2.5 p-1">
                    ${actionPlanHtml}
                  </ul>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  `;

  // Bind Back buttons
  const handleBack = () => {
    state.activeTab = 'overview';
    // Trigger sidebar update and workspace redraw
    const homeBtn = document.querySelector('button[data-tab="overview"]');
    if (homeBtn) homeBtn.click();
  };
  document.getElementById('workspace-back-btn').addEventListener('click', handleBack);
  document.getElementById('workspace-back-top-btn').addEventListener('click', handleBack);

  // Bind Indicator tabs
  container.querySelectorAll('.indicator-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const indId = parseInt(btn.getAttribute('data-indicator-id'));
      onIndicatorSelect(indId);
    });
  });

  // Bind alert details inside alerts list
  container.querySelectorAll('.btn-detail-alert').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const alertId = btn.getAttribute('data-alert-id');
      showAlertDetailModal(alertId, state.alerts, state.selectedProfile);
    });
  });

  // Re-initialize Lucide Icons inside workspace
  if (window.lucide) window.lucide.createIcons();
}
