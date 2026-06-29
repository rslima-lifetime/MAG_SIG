# Matriz de Governança e Perfis de Acesso - MAG Gente 360

## 1. Diretrizes de Confidencialidade e LGPD
O MAG Gente 360 consolida dados sensíveis de carreira, remuneração, avaliações qualitativas e compliance. Para garantir conformidade com a LGPD e as políticas internas da MAG Seguros, o acesso é restrito com base em papéis específicos (RBAC).

*   **Dados Comuns**: Cadastro, horas de treinamento, alcance de metas aggregadas e participação em projetos internos são de visualização ampla para a linha hierárquica.
*   **Dados Restritos**: Pareceres qualitativos de RH, detalhes de desligamento e mapeamento fino de sucessão são visíveis apenas para o RH e diretoria executiva.
*   **Dados Confidenciais (Sensíveis)**: Denúncias registradas, processos jurídicos/compliance e pareceres de risco críticos possuem acesso restrito aos times de Compliance, Jurídico e alta governança de G&G.

---

## 2. Matriz de Perfis de Acesso

| Funcionalidade / Campo | RH Estratégico | Business Partner (BP) | Diretoria | Gestor | Compliance / Jurídico | Dados G&G (Técnico) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dados Cadastrais do Líder** | Sim | Sim | Sim | Sim (Próprio) | Sim | Sim |
| **Índice de Saúde (ISL)** | Sim | Sim | Sim | Sim (Próprio) | Sim | Sim |
| **Indicadores de Vendas/Metas** | Sim | Sim | Sim | Sim (Próprio) | Sim | Sim |
| **Mapeamento de Sucessão** | Sim | Sim | Sim | Não | Não | Sim |
| **Parecer Qualitativo de RH** | Sim | Sim (Alocados) | Sim | Não | Não | Sim |
| **Detalhamento de Denúncias** | Não | Não | Não | Não | Sim | Não |
| **Acessos Gerais de Risco** | Sinalizador | Sinalizador | Sinalizador | Oculto | Detalhado | Estrutural |
| **Importar/Exportar Banco** | Sim | Não | Não | Não | Não | Sim |

---

## 3. Regras de Exibição no Mockup Funcional
Para demonstrar a governança na prática, o protótipo implementa reações dinâmicas conforme o perfil selecionado:
1.  **Perfil Gestor / Diretoria**: O bloco "9. PARECER DE RH" é completamente removido da tela, exibindo um aviso: *"Parecer de RH restrito a perfis autorizados"*. O indicador "Denúncias" no card de Risco é ocultado ou exibe apenas a conformidade geral.
2.  **Perfil RH Estratégico**: Exibe o parecer qualitativo completo, com nome da BP e data, e permite exportar/importar dados.
3.  **Perfil Compliance / Jurídico**: Foco no detalhamento de Risco & Compliance, exibindo alertas detalhados de denúncias e conformidade legal, ocultando o parecer estratégico de RH se não aplicável.
