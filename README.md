# SIG - Sistema Integrado de Gestão (Raio-X da Liderança e Jornada das Pessoas)

Este é o projeto inicial de estruturação do **SIG (Sistema Integrado de Gestão)**, uma solução de consulta estratégica desenvolvida para a área de Gente & Gestão da MAG Seguros. 

O sistema consolida visões integradas sobre lideranças (Raio-X da Liderança), a saúde dos times (Raio-X do Time) e a trajetória histórica dos liderados (Jornada dos Liderados) em uma interface executiva unificada, servindo de suporte a decisões críticas como sucessão, desenvolvimento, retenção e riscos.

---

## 1. Estrutura de Pastas do Projeto

```
mag-gente-360/
├── README.md                          # Instruções de execução e arquitetura do projeto
├── server.js                          # Servidor estático leve em Node.js (sem dependências)
├── iniciar.bat                        # Script do Windows para iniciar e abrir o app no navegador
├── index.html                         # Ponto de entrada do SPA
├── src/
│   ├── app.js                         # Inicializador, controle de estado, filtros e importação/exportação
│   ├── css/
│   │   └── styles.css                 # Estilos customizados (glassmorphism, animações, regras de impressão)
│   ├── components/
│   │   ├── Header.js                  # Cabeçalho com filtros, perfil e ações de dados
│   │   ├── Sidebar.js                 # Navegação lateral
│   │   ├── Cards.js                   # Cards de Perfil, Dimensões e Potencial
│   │   ├── HealthScore.js             # Card do Índice de Saúde e gráficos circulares
│   │   ├── Tables.js                  # Tabelas de histórico, outros indicadores e pareceres de RH
│   │   └── Timeline.js                # Painel de Time (Layer 2) e Jornada dos Liderados (Layer 3)
│   ├── data/
│   │   ├── mockLeadership.json        # Dados cadastrais e scores dos líderes
│   │   ├── mockTeam.json              # Dados de saúde do time e pendências de gestão
│   │   ├── mockJourney.json           # Linha do tempo e liderados de cada gestor
│   │   └── mockIndicators.json        # Regras de cálculo dos 27 indicadores mapeados
│   └── docs/
│       ├── product-vision.md          # Visão estratégica e princípios éticos de Gente & Gestão
│       ├── requirements.md            # Mapeamento detalhado de requisitos funcionais e não funcionais
│       ├── governance.md              # Matriz de controle de acessos (RBAC) e regras LGPD
│       ├── indicators-matrix.md       # Regras de cálculo das dimensões e pesos do Índice de Saúde
│       ├── data-sources.md            # Sistemas de registro oficiais mapeados (ADP, Cornerstone, etc.)
│       └── backlog.md                 # Backlog inicial em formato de Épicos e Histórias de Usuário
```

---

## 2. Como Rodar e Testar o Mockup

Para rodar a aplicação localmente evitando restrições de segurança do navegador (CORS) e garantindo funcionamento dos dados JSON:

### Método Rápido (Recomendado no Windows)
1.  Navegue até a pasta `mag-gente-360`.
2.  Dê um **duplo clique no arquivo `iniciar.bat`**.
3.  O script irá:
    *   Configurar a variável PATH temporária para usar o Node.js local.
    *   Abrir automaticamente o seu navegador em `http://localhost:3000`.
    *   Iniciar o servidor estático Node.js em segundo plano.

### Método Manual via Terminal
Abra o terminal do PowerShell na pasta do projeto e execute:
```powershell
$env:PATH = 'C:\Users\roslima\.gemini\antigravity\node-v22.11.0-win-x64;' + $env:PATH
node server.js
```
Em seguida, abra o navegador e acesse: [http://localhost:3000](http://localhost:3000)

---

## 3. Funcionalidades de Destaque no Mockup

1.  **Filtros Interativos**: Mude de líder e período no cabeçalho. Os dados de todos os cards, gráficos SVG e timeline serão atualizados instantaneamente.
2.  **Explicabilidade do Score**: Passe o mouse sobre o ícone de informação (i) no card **Health Score** para ver o detalhamento analítico da fórmula de cálculo e regras especiais.
3.  **Redistribuição de Pesos (Dados Insuficientes)**: Selecione a líder **Patricia Alves (TI)**. Como ela não possui dados comerciais, a dimensão "Resultado" é sinalizada como "Dados insuficientes" e o Índice de Saúde final é recalculado sem penalizar o score total.
4.  **Penalidade de Risco (Redutor)**: Selecione o líder **João Ribeiro (Riscos)**. O sistema identifica um score de risco crítico e subtrai automaticamente **15 pontos** do seu Índice de Saúde final, exibindo um alerta vermelho no painel.
5.  **Simulação de Governança (Controle de Perfis)**:
    *   Use o seletor **Perfil de Acesso (Teste)** no cabeçalho.
    *   Ao mudar para **Gestor** ou **Diretoria**, o **Parecer de RH** é imediatamente ocultado por restrição de segurança e os dados de denúncias no card de risco são mascarados.
    *   Ao mudar para **RH Estratégico** ou **BP**, o parecer com assinatura e data é exibido normalmente.
6.  **Ciclo de Importação/Exportação**:
    *   Use o botão **Exportar** para baixar a base atual de dados em arquivo JSON.
    *   Use o botão **Importar** para carregar um JSON e alimentar a tela de forma dinâmica (os dados são persistidos no seu `localStorage`).
    *   Use o botão de **Reset** (ao lado de Imprimir) para restaurar os dados originais da simulação.
7.  **Relatório Impresso Limpo (PDF)**:
    *   Clique em **Imprimir** para abrir a janela de impressão formatada pelo CSS. O menu lateral, cabeçalho de ações e botões são automaticamente removidos para gerar um PDF executivo limpo para reuniões.
