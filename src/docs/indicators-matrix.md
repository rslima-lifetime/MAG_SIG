# Matriz de Indicadores e Score de Saúde - MAG Gente 360

## 1. Composição do Índice de Saúde da Liderança (ISL)
O **Índice de Saúde da Liderança** é um score explicável de 0 a 100 projetado como um sinalizador de suporte e atenção para a tomada de decisão humana.

### Fórmulas de Cálculo e Pesos
O score é calculado com base nas seguintes dimensões:
1.  **Resultado**: 25% do peso.
2.  **Gestão de Pessoas**: 25% do peso.
3.  **Cultura**: 20% do peso.
4.  **Desenvolvimento**: 15% do peso.
5.  **Risco & Compliance**: 15% do peso.

### Regra para Dados Insuficientes (Áreas Corporativas)
Se uma liderança pertence a uma área corporativa (TI, RH, Jurídico) que não possui metas de vendas ou faturamento comercial (Dimensão Resultado Comercial), o sistema adota a **Redistribuição Proporcional de Pesos**:
*   A dimensão "Resultado" é marcada como *"Dados Insuficientes"*.
*   O peso restante (75%) é redistribuído proporcionalmente:
    *   **Gestão de Pessoas**: 33,3% (original: 25% / 0.75)
    *   **Cultura**: 26,7% (original: 20% / 0.75)
    *   **Desenvolvimento**: 20,0% (original: 15% / 0.75)
    *   **Risco & Compliance**: 20,0% (original: 15% / 0.75)

### Regra Especial para Riscos (Redutor)
Se o score da dimensão **Risco & Compliance** cair abaixo de **50 pontos** (indicando pendências críticas ou denúncias confirmadas), ele atua como um **Redutor Absoluto no score final (ISL)**:
*   É aplicada uma penalidade de **-15 pontos** no Índice de Saúde final.
*   Um alerta vermelho "Atenção Crítica: Risco Alto" é exibido no topo do painel.

---

## 2. Catálogo dos 27 Indicadores

| ID | Indicador | Dimensão | Regra de Cálculo Simplificada | Nível de Sensibilidade |
| :--- | :--- | :---: | :--- | :---: |
| 1 | Denúncias | Risco | Número de denúncias procedentes (Alerta se > 0) | Altíssima (Restrito) |
| 2 | Resultado do Ciclo de Gente | Gestão | Enquadramento na matriz 9-box (Potencial e Performance) | Média |
| 3 | Resultado da GPTW | Gestão | Média de notas de clima dadas pelo time liderado | Baixa |
| 4 | Resultado de Vendas | Resultado | Percentual de atingimento da meta comercial anual | Baixa |
| 5 | Treinandos por Gestor | Gestão | Média de treinandos alocados sob a liderança (Vendas) | Baixa |
| 6 | Performance dos Treinandos | Resultado | Nota média de desempenho da equipe de treinandos | Baixa |
| 7 | Colaboradores-Chave | Gestão | Quantidade de talentos classificados como "Críticos" no time | Média |
| 8 | Turnover do Time | Gestão | Taxa anual de rotatividade do time (Alerta se > 10%) | Baixa |
| 9 | Histórico de Aprovações Legais | Risco | Percentual de conformidade em aprovações contratuais | Média |
| 10 | Treinamentos Obrigatórios | Risco / Desenv | Percentual de conclusão das trilhas regulatórias (Ex: LGPD, PLD) | Baixa |
| 11 | Treinamentos de Liderança | Desenvolvimento| Horas de treinamento voltadas à gestão no ano | Baixa |
| 12 | Mapeamento de Sucessão | Gestão | Quantidade de sucessores identificados para o cargo do líder | Alta |
| 13 | Metas Individuais (Corporativo) | Resultado | Percentual de atingimento do KPO corporativo individual | Baixa |
| 14 | Participação em Projetos-Chave | Cultura / Res | Projetos estratégicos corporativos com liderança ativa | Baixa |
| 15 | Última Promoção ou Mérito | Histórico | Histórico da última alteração salarial ou cargo (meses) | Média |
| 16 | Treinamentos MAG Universidade | Desenvolvimento| Total de horas consumidas na plataforma corporativa | Baixa |
| 17 | Histórico Extracurricular | Desenvolvimento| Cursos externos, MBAs, certificações técnicas | Média |
| 18 | Premiação em Campanhas | Resultado | Conquistas em prêmios internos (ex: Galo de Ouro) | Baixa |
| 19 | Projetos Internos | Cultura | Participação no MAG Knows, Hackathons e Insurtech | Baixa |
| 20 | Parecer de RH | Cultura / Risco | Avaliação qualitativa da Business Partner (Favorável / Atenção) | Alta (Restrito) |
| 21 | Gestão de Pessoas (Ponto/Férias) | Gestão | % de cartões de ponto assinados e férias programadas em dia | Baixa |
| 22 | Absenteísmo da Equipe | Outros | % de horas de ausência não justificadas do time | Baixa |
| 23 | Movimentação Interna | Outros | Número de colaboradores promovidos para fora da área | Baixa |
| 24 | Tempo Médio p/ Preencher Vagas | Outros | Média de dias para fechamento de vagas da equipe | Baixa |
| 25 | Engajamento nas Avaliações | Outros | % de preenchimento dos formulários do Ciclo de Gente no time | Baixa |
| 26 | Diversidade da Equipe | Outros | % de diversidade de gênero e raça no time liderado | Baixa |
| 27 | Retenção de Talentos-Chave | Outros | % de colaboradores-chave que permaneceram na empresa | Média |
