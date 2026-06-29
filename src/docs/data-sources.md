# Matriz de Fontes de Dados - MAG Gente 360

Este documento mapeia as origens dos dados de cada indicador, estabelecendo os sistemas de registro (Systems of Record) oficiais da MAG Seguros.

## 1. Mapeamento de Sistemas Integrados

| Indicadores | Sistema de Origem (MAG) | Frequência de Atualização | Tipo de Integração |
| :--- | :--- | :---: | :---: |
| **Dados Cadastrais, Turnover, Absenteísmo, Movimentações** | Sistema de Folha de Pagamento (ADP / Sênior) | Diária | API REST (JSON) |
| **Ciclo de Gente, Sucessão, Potencial** | Portal de Desempenho (Cornerstone) | Semestral | Carga em Lote (SFTP) |
| **Clima Organizacional (GPTW)** | Plataforma GPTW (Great Place to Work) | Anual | API REST |
| **Treinamentos Obrigatórios, Horas de Curso, MAG Universidade** | MAG Universidade (LMS - Moodle customizado) | Semanal | API REST |
| **Resultados de Vendas, Campanhas (Galo de Ouro)** | CRM de Vendas e BI Comercial (Salesforce / Qlik Sense) | Diária | API REST |
| **Metas Corporativas individuais** | Sistema de Metas Corporativas (SuccessFactors) | Trimestral | API REST |
| **Denúncias, Riscos e Conformidade** | Canal de Ética e Compliance (Contato Seguro) | Em tempo real | Webhook Seguro |
| **Assinatura de Ponto, Aprovação de Férias** | Sistema de Ponto Eletrônico (Dimep / Senior) | Diária | API REST |
| **Pareceres de RH** | Formulário de Pareceres de Business Partners (G&G Interno) | Conforme demanda | Gravação em Tela |

---

## 2. Estrutura dos Arquivos JSON locais (Simulação)
Para o mockup funcional local, os dados dessas fontes integradas são simulados por 4 arquivos JSON locais estruturados de forma relacional:

1.  **`mockLeadership.json`**: Contém os perfis dos líderes e seus scores consolidados.
2.  **`mockTeam.json`**: Detalha a saúde e pendências dos times correspondentes.
3.  **`mockJourney.json`**: Traz a timeline histórica e conquistas da carreira.
4.  **`mockIndicators.json`**: Guarda as regras de cálculo e definições técnicas de cada indicador.
