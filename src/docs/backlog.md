# Backlog do Produto - MAG Gente 360

Este documento apresenta a divisão do projeto em Épicos (EP) e Histórias de Usuário (US) para planejamento de sprints de desenvolvimento.

## Épico 01: Visualização Integrada (Raio-X)

### US01.1 - Perfil Cadastral e Filtros Globais
*   **Como** Business Partner ou Diretor,
*   **Quero** selecionar um líder e o período de referência no topo do sistema,
*   **Para** consultar instantaneamente os dados de identificação e reporte de qualquer profissional da MAG.
*   *Critérios de Aceitação*:
    *   Filtro reage em tempo real atualizando a tela.
    *   Dados cadastrais incluem cargo, área, diretoria, tempo de casa, tempo no cargo e reporte.

### US01.2 - Detalhamento das 5 Dimensões e Indicadores
*   **Como** analista de Gente & Gestão,
*   **Quero** visualizar os 27 indicadores organizados nas dimensões de Resultado, Gestão de Pessoas, Desenvolvimento, Cultura e Risco,
*   **Para** diagnosticar em qual área a liderança precisa de mais suporte.
*   *Critérios de Aceitação*:
    *   Cada indicador deve conter número identificador, nome e valor.
    *   Indicadores com alerta visual de atenção ou conformidade.

### US01.3 - Índice de Saúde da Liderança (Score)
*   **Como** Diretor de Gente & Gestão,
*   **Quero** visualizar um score unificado explicável baseado nos pesos das dimensões,
*   **Para** identificar de forma rápida o nível geral de saúde da liderança analisada.
*   *Critérios de Aceitação*:
    *   O cálculo deve seguir a regra de pesos (25/25/20/15/15).
    *   Redistribuição proporcional de pesos para áreas sem dados comerciais.

---

## Épico 02: Governança e Segurança

### US02.1 - Controle de Visualização por Perfil
*   **Como** Administrador do Sistema,
*   **Quero** restringir a exibição do parecer qualitativo de RH e detalhes de denúncias para perfis de gestores comuns,
*   **Para** garantir a confidencialidade e cumprimento das regras da LGPD.
*   *Critérios de Aceitação*:
    *   Ao selecionar o perfil "Gestor", o Parecer de RH deve sumir da interface e exibir uma mensagem de restrição.
    *   O indicador "Denúncias" deve exibir apenas conformidade agregada, ocultando a contagem de denúncias.

### US02.2 - Registro de Autoria do Parecer de RH
*   **Como** Diretor de RH,
*   **Quero** visualizar a data e o nome do Business Partner que registrou o parecer qualitativo,
*   **Para** garantir rastreabilidade e governança humana sobre o parecer.

---

## Épico 03: Portabilidade e Ciclo de Dados

### US03.1 - Exportação de Dados Ativos
*   **Como** analista de Dados de G&G,
*   **Quero** exportar a base de dados ativa do navegador para um arquivo JSON,
*   **Para** fazer backups ou carregar a base modificada em outra estação de trabalho.

### US03.2 - Importação Dinâmica com Validação
*   **Como** usuário estratégico de RH,
*   **Quero** carregar um arquivo JSON contendo dados de novos líderes no sistema,
*   **Para** atualizar o dashboard sem precisar de suporte técnico ou códigos de programação.
*   *Critérios de Aceitação*:
    *   Validação de estrutura JSON com aviso de erro se incorreto.
    *   Salvamento persistente em `localStorage`.
