# Requisitos do Sistema - MAG Gente 360

Este documento detalha os requisitos funcionais e não funcionais do sistema MAG Gente 360.

## 1. Requisitos Funcionais (RF)

### RF01 - Seleção de Liderança e Filtros Globais
*   O sistema deve permitir selecionar uma liderança da MAG através de um dropdown no cabeçalho.
*   O sistema deve permitir selecionar o Período de Referência (Ano).
*   Ao alterar qualquer filtro, todos os dados da tela (perfil, scores, indicadores, linha do tempo e parecer) devem atualizar instantaneamente.

### RF02 - Visualização do Raio-X da Liderança
*   Exibir card com dados cadastrais do líder: nome, cargo, área/diretoria, tempo de empresa, tempo na função, reporte direto e avatar.
*   Exibir o Índice de Saúde da Liderança de forma gráfica (círculo radial de 0 a 100).
*   Exibir cards detalhados para as 5 dimensões: Resultado, Gestão de Pessoas, Desenvolvimento, Cultura e Risco & Compliance.

### RF03 - Detalhamento das Dimensões
*   Cada card de dimensão deve listar seus respectivos indicadores contendo: número do indicador, nome, valor, unidade e tendência visual (seta ou sparkline).
*   O card de Risco deve destacar alertas com ícones coloridos (ex: exclamação amarela para atenção, check verde para regular).

### RF04 - Histórico em Linha do Tempo
*   Exibir uma tabela histórica anualizada consolidando a evolução da liderança (promoções, GPTW do time, Ciclo de Gente, volume de vendas, denúncias e treinamentos).

### RF05 - Parecer de RH com Registro de Autoria
*   Exibir o parecer qualitativo de RH com o texto de recomendação, data de registro e o nome/cargo do Business Partner responsável pela inserção.

### RF06 - Controle de Acesso e Governança de Perfis
*   Exibir um seletor de Perfil de Acesso para testes de governança.
*   **Regra de Ocultação**: Se o perfil for "Gestor" ou "Diretoria" (não autorizados), os detalhes de denúncias e o bloco do Parecer de RH devem ser ocultados ou substituídos por mensagens de restrição.

### RF07 - Importação e Exportação de JSON
*   **Exportar**: Permitir baixar o banco de dados ativo em formato `mag-gente-360-dados.json`.
*   **Importar**: Permitir fazer upload de um arquivo JSON. O sistema deve validar os dados e atualizar o estado ativo no `localStorage`.
*   **Restaurar Padrão**: Botão para apagar as alterações e reverter para a base simulada original.

### RF08 - Impressão Executiva (Relatório PDF)
*   Fornecer um botão "Imprimir" que abra a formatação de impressão do sistema. A folha de estilo de impressão deve ocultar a sidebar, o seletor de perfis e os botões de ação, exibindo apenas o relatório executivo limpo.

---

## 2. Requisitos Não Funcionais (RNF)

### RNF01 - Execução Sem Dependência (Local Server)
*   O protótipo deve rodar localmente utilizando um servidor HTTP simples escrito em Node.js sem pacotes adicionais (`npm install`), servindo arquivos estáticos.

### RNF02 - Persistência no Navegador
*   Os dados ativos devem ser persistidos no `localStorage` do navegador para preservar o estado após atualizações de página (`F5`).

### RNF03 - Interface Responsiva e Estética de Alto Nível
*   A interface deve seguir a paleta corporativa da MAG Seguros (Azul escuro, azul claro, verde, laranja, vermelho e roxo) e usar a tipografia Inter.
*   Implementar efeitos de hover e transições suaves.

### RNF04 - Segurança da Informação (Simulada)
*   O sistema deve simular o controle de acesso com base no perfil selecionado, impedindo vazamento de dados sensíveis na árvore de renderização do DOM.
