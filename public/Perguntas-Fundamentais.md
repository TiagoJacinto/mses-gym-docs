# Perguntas Fundamentais — Sistema de Gestão para Ginásio

Este documento recolhe as perguntas fundamentais para verificação integral da compreensão do sistema de gestão para ginásio. Cada pergunta inclui a resposta, dicas de estudo e referência à secção correspondente no índice do trabalho.

---

## 1. Identificação e Propósito do Sistema

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Qual é o problema operacional que este sistema resolve e qual o seu objetivo principal? |
| **Resposta** | O sistema resolve as ineficiências de ginásios que dependem de registos em papel ou ferramentas desatualizadas. Digitaliza o ciclo completo do utente: desde a inscrição e controlo de assiduidade até à monitorização da evolução física. O objetivo é substituir fluxos de trabalho fragmentados e manuais por uma solução digital de gestão integrada. |
| **Dicas** | Foca na palavra "digitaliza" — o sistema passa de papel para plataforma integrada. O objetivo não é apenas registar dados, mas criar um sistema coeso que una todas as operações do ginásio. |
| **Referência** | Secção 2.1 — Descrição do Problema; Secção 2.1.2 — Objetivo do Software |

---

## 2. Arquitetura Funcional do Sistema

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são as duas áreas funcionais complementares do sistema e o que faz cada uma? |
| **Resposta** | (1) **Vertente administrativa/financeira** — gere inscrições, assiduidade, pagamentos e documentação legal. (2) **Vertente técnico-pedagógica** — o instrutor prescreve e acompanha planos de treino adaptados a cada perfil de utente. |
| **Dicas** | As duas áreas têm actores diferentes: a administrativa envolve o Responsável Administrativo e a Rececionista; a técnica envolve o Instrutor. Ambas convergem no utente. |
| **Referência** | Secção 2.1.3 — Contexto de Utilização |

---

## 3. Stakeholders e Actores

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são os actores principais do sistema e qual a responsabilidade de cada um? |
| **Resposta** | **Responsável Administrativo** — organiza inscrições, pagamentos, contratos. **Instrutor de Educação Física** — avaliações físicas e prescrição de planos de treino. **Utente** — regista presenças, consulta planos, reserva aulas. **Rececionista** — regista entradas/saídas, atende utentes. **Gerente** — consulta relatórios e métricas. **Coordenador de Aulas** — gere horários e instrutores. |
| **Dicas** | Há três categorias de actores: principais (usam o sistema directamente), secundários (recebem informação) e administradores (gestão técnica). O DPO é um actor secundário que garante conformidade RGPD. |
| **Referência** | Secção 3 — Stakeholders e Utilizadores |

---

## 4. Requisitos Funcionais — Gestão de Utentes

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são as operações CRUD sobre registos de utentes e quais as condições de bloqueio? |
| **Resposta** | Criar (RF-01), consultar (RF-02), atualizar (RF-03) e desativar (RF-04). Um utente desativado mantém os dados acessíveis para consulta histórica, mas não pode fazer novas inscrições. O sistema bloqueia inscrições quando há mensalidades em atraso ou documentação desportiva (seguro/atestado) fora da validade. |
| **Dicas** | A desativação é "soft delete" — os dados permanecem. Importante: utentes com mensalidades em atraso não podem fazer novas inscrições (RF-10 valida isto). |
| **Referência** | Secção 4.1 — RF-01 a RF-04; UC-01 — Gerir Registo de Utentes |

---

## 5. Avaliações Físicas e Métricas Biométricas

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Que dados biométricos são recolhidos durante uma avaliação física e que métricas são calculadas automaticamente? |
| **Resposta** | O instrutor regista peso, altura, dobras cutâneas e perímetros. O sistema calcula automaticamente o IMC, a massa gorda (fórmula Jackson-Pollock) e o VO2 máximo (fórmula de Cooper). A validade de cada avaliação é de 6 meses. |
| **Dicas** | As três fórmulas são importantes: IMC = peso/altura², Jackson-Pollock para massa gorda, Cooper para VO2 máximo. Avaliações expiradas geram alerta automático (RF-24). |
| **Referência** | Secção 4.1 — RF-05; UC-06 — Realizar Avaliação Física; Secção 5.1 — Classe AvaliacaoFisica |

---

## 6. Planos de Treino

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Como se estrutura um plano de treino e quais os requisitos para a sua prescrição? |
| **Resposta** | O instrutor cria um plano com objectivo e duração, e adiciona exercícios indicando séries, repetições, carga e descanso. O sistema recalcula o volume total após cada alteração. Pré-condição: utente tem de ter uma avaliação física válida e recente (dentro dos 6 meses). |
| **Dicas** | Sem avaliação válida, não há prescrição de plano — é umachain obrigatória. O ItemPlanoTreino é a classe que liga exercícios ao plano com os parâmetros de treino. |
| **Referência** | Secção 4.1 — RF-06 a RF-08; UC-07 — Prescrever Plano de Treino; UC-08 — Consultar Histórico de Evolução |

---

## 7. Inscrições e Documentação Legal

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Como funciona o processo de inscrição e que validações são feitas automaticamente pelo sistema? |
| **Resposta** | O Responsável Administrativo cria uma inscrição associando utente a uma modalidade. No momento da inscrição, o sistema verifica automaticamente se o seguro desportivo e o atestado médico ainda são válidos (RF-10). Se algum documento estiver fora da validade, a inscrição é bloqueada. Utentes com mensalidades em atraso também são bloqueados. |
| **Dicas** | São três os bloqueios: (1) seguro expirado, (2) atestado expirado, (3) mensalidades em atraso. O sistema valida documentos de forma automática — não é o utilizador que decide. |
| **Referência** | Secção 4.1 — RF-09 a RF-12; UC-02 — Efetuar Inscrição em Modalidade; UC-05 — Gerir Contratos e Seguros Desportivos |

---

## 8. Assiduidade — Check-in e Check-out

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Qual o fluxo completo do processo de check-in e que validações são feitas antes de autorizar o acesso? |
| **Resposta** | O utente passa cartão/código no ponto de entrada. O sistema valida: (1) inscrição activa, (2) mensalidade regularizada, (3) documentação desportiva válida (seguro e atestado). Se tudo estiver OK, regista a hora de entrada. Se a mensalidade estiver em atraso ou o seguro expirado, o acesso é bloqueado. O check-out calcula o tempo de permanência. |
| **Dicas** | Três validações antes de autorizar — este é o fluxo modelado no diagrama de actividades. O sistema não é apenas um relógio de ponto; faz validações activas que podem bloquear o acesso. |
| **Referência** | Secção 4.1 — RF-13 a RF-15; UC-04 e UC-04b — Controlar Assiduidade; Secção 5.2 — Diagrama de Atividades |

---

## 9. Pagamentos e Faturação

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Como funciona a geração automática de mensalidades e o processo de pagamento? |
| **Resposta** | No dia 1 de cada mês, o sistema gera automaticamente as mensalidades para todos os utentes com inscrição activa (RF-16). A rececionista ou o sistema regista pagamentos totais ou parciais. Pagamentos parciais deixam saldo devedor. O sistema impede reservas de aulas e inscrições quando há mensalidades em atraso. |
| **Dicas** | A mensalidade pode ficar "Pago", "Parcialmente Pago" ou "Pendente". O gateway de pagamento externo processa transacções automaticamente (UC-13). Relatórios de faturação são gerados pelo Gerente (RF-26). |
| **Referência** | Secção 4.1 — RF-16 a RF-18; UC-03 — Processar Pagamento de Mensalidade; UC-12 — Gerar Relatórios de Faturação; UC-13 — Processar Pagamento via Gateway Externo |

---

## 10. Aulas de Grupo

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Como funciona o sistema de reservas de aulas de grupo e que regras de lotação se aplicam? |
| **Resposta** | O Coordenador de Aulas cria aulas com horário, duração, lotação máxima e instrutor. Utentes ou rececionistas reservam vaga. Se a aula estiver cheia, o utente fica em lista de espera. Cancelamento sem penalização é até 2h antes do início da aula; após esse prazo, a vaga é perdida. O sistema impede reservas quando a lotação máxima é atingida. |
| **Dicas** | A regra das 2h é importante para cancelamento. A lotação máxima é um constraint hard — o sistema não permite ultrapassar. ReservaAula tem uma propriedade posicaoListaEspera para gerir a fila. |
| **Referência** | Secção 4.1 — RF-19 a RF-22; UC-09 — Criar Aula de Grupo; UC-11 — Reservar Vaga em Aula de Grupo |

---

## 11. Requisitos Não Funcionais — Privacidade e Segurança (RGPD)

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Que requisitos RGPD são aplicados pelo sistema e como são garantidos os direitos dos titulares? |
| **Resposta** | O sistema recolhe apenas dados biométricos necessários para avaliação física e prescrição de treino. Não são recolhidos dados clínicos, genéticos ou sinais vitais avançados (RNF-01a). Os dados são usados exclusivamente para as finalidades comunicadas — outra finalidade requer consentimento explícito (RNF-01b). Todos os dados biométricos são encriptados com AES-256 (RNF-01d). Os titulares podem aceder, corrigir ou eliminar os seus dados num prazo ≤ 15 dias úteis (RNF-01c). |
| **Dicas** | RGPD tem quatro dimensões neste sistema: minimização, finalidade, direitos dos titulares e encriptação. O DPO é o actor responsável por garantir conformidade. |
| **Referência** | Secção 4.2 — RNF-01a a RNF-01d; Secção 3 — Actor DPO |

---

## 12. Requisitos Não Funcionais — Disponibilidade e Desempenho

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são os requisitos de disponibilidade e desempenho do sistema? |
| **Resposta** | Disponibilidade de 98% durante horário do ginásio (08:00–22:00), com máximo de 30 minutos de indisponibilidade contínua (RNF-02a). Recuperação após incidente em até 30 minutos com alerta automático ao administrador (RNF-02b). Check-in/check-out: < 1 segundo. Consultas de utente: < 2 segundos. Relatórios de evolução (até 12 meses): < 30 segundos. |
| **Dicas** | O horário do ginásio é 08:00–22:00 — a disponibilidade de 98% é medida dentro deste período, não 24/7. Três numbers para decorar: 1s, 2s, 30s para as três operações críticas. |
| **Referência** | Secção 4.2 — RNF-02a, RNF-02b, RNF-04a a RNF-04c |

---

## 13. Requisitos Não Funcionais — Segurança da Autenticação

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Como funciona a autenticação e o controlo de acessos no sistema? |
| **Resposta** | Passwords guardadas com hash bcrypt (RNF-05a). Sessões autenticadas expiram ao fim de 30 minutos sem actividade, com aviso 5 minutos antes (RNF-05b). Cada pessoa tem apenas um perfil de acesso e apenas o Administrador de Sistema pode alterar perfis (RNF-05c). Existe registo de auditoria para todas as operações sensíveis com identificador único, data/hora UTC, tipo de operação, utilizador, perfil, recurso afectado, IP e resultado (RNF-06a). Logs são imutáveis — não é possível alterá-los ou eliminá-los (RNF-07a). |
| **Dicas** | Hash bcrypt com salt individual é o standard. O logout automático aos 30 minutos com aviso aos 25min protege sessões abandonadas. Registo de auditoria com 8 campos permite rastrear qualquer operação. |
| **Referência** | Secção 4.2 — RNF-05a a RNF-07b; UC-10 — Autenticar no Sistema |

---

## 14. Diagrama de Classes — Estrutura Principal

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Qual é a estrutura de classes principal e quais as relações entre Utilizador, Colaborador e as especializações? |
| **Resposta** | A classe abstracta `Utilizador` tem duas subclasses: `Utente` e `Colaborador`. `Colaborador` é abstracto e specialization em Instrutor, ResponsavelAdministrativo, Rececionista, Gerente, AdministradorSistema e CoordenadorAulas. A enumeração PerfilAcesso define os sete perfis possíveis. Associações-chave: Utente tem 0..* Inscricao, 0..* AvaliacaoFisica, 0..* PlanoTreino; Inscricao agrega Modalidade e gera 0..* Mensalidade; Mensalidade é liquidada por 0..* Pagamento via GatewayPagamento. |
| **Dicas** | Hierarquia: Utilizador abstracto → Utente / Colaborador abstracto → 6 especializações. Associaões com multiplicidades são fundamentais para perceber o modelo de dados conceptual. O diagrama Mermaid está na secção 5.1. |
| **Referência** | Secção 5.1 — Diagrama de Classes |

---

## 15. Requisitos Não Funcionais — Backup e Retenção

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são os requisitos de backup, retenção de dados e restaurabilidade? |
| **Resposta** | Backups encriptados com AES-256 (RNF-08a). Teste completo de restauração uma vez por trimestre. Todos os backups mantidos durante ≥ 90 dias, com alerta automático quando um backup ultrapassa os 85 dias (RNF-09a). Restaurabilidade total em até 4 horas a partir dos backups após desastre, com plano documentado e testado uma vez por semestre (RNF-09b). Retenção de registos (auditoria, financeiros, utentes) durante ≥ 5 anos; eliminação automática em ≤ 30 dias no fim do período, excepto se houver litígios pendentes (RNF-11). |
| **Dicas** | 4 horas para restaurabilidade total, 90 dias de retenção de backups, 5 anos de retenção de dados operacionais. O plano de disaster recovery tem de ser documentado e testado. |
| **Referência** | Secção 4.2 — RNF-08a, RNF-09a, RNF-09b, RNF-11 |

---

## 16. Diagrama de Actividades — Fluxo de Check-in

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Descreva o fluxo de check-in modelado no diagrama de actividades, incluindo as decisões e acções paralelas. |
| **Resposta** | O fluxo começa com o utente a apresentar cartão/código. Se o utente não for identificado, o acesso é recusado e a tentativa é registada. Se for identificado, o sistema verifica três condições em cascata: inscrição activa → mensalidade regularizada → documentação desportiva válida. Só depois destas três verificações o acesso é autorizado. Após a autorização, um fork executa três tarefas em paralelo: registar entrada, actualizar lotação/mapa de frequência, e verificar alertas técnicos pendentes. Se a avaliação física estiver expirada, o instrutor e utente são notificados para nova avaliação. O join sincroniza as três ramas paralelas antes de confirmar o check-in. |
| **Dicas** | Three cascata de decisões (inscrição → mensalidade → documentação) é o padrão de gate. O fork/join representa paralelismo real — as três tarefas ocorrem em paralelo após autorização. A decisão sobre avaliação expirada é um caminho alternativo que não bloqueia o acesso. |
| **Referência** | Secção 5.2 — Diagrama de Atividades |

---

## 17. Diagramas de Sequência — Inscrição e Prescrição

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são os fluxos alternativos nos diagramas de sequência de inscrição e prescrição de plano de treino? |
| **Resposta** | **Inscrição (UC-02/5.3.1):** Se a cobrança da taxa de inscrição falhar, o sistema destrói o débito, contrato e inscrição provisórios. Se a documentação desportiva for inválida, a inscrição é bloqueada por seguro ou atestado expirado. Se houver pagamentos em atraso, a inscrição é bloqueada por dívida pendente. Se a modalidade estiver inactiva, o sistema sugere escolher outra. **Prescrição de Plano (UC-07/5.3.2):** Se a avaliação estiver expirada, o sistema alerta para actualizar a avaliação física. Se não existirem avaliações registadas, o sistema alerta para realizar a primeira avaliação. |
| **Dicas** | Os fluxos alternativos mostram as defesas do sistema — todas as condições de falha que impedem a operação de continuar. São as pré-condições que protegem a integridade do processo. |
| **Referência** | Secção 5.3.1 — Sequência de Inscrição; Secção 5.3.2 — Sequência de Prescrição de Plano de Treino |

---

## 18. Requisitos de Usabilidade e Acessibilidade

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Quais são os requisitos de usabilidade e acessibilidade da interface? |
| **Resposta** | Operações frequentes (criar inscrições, check-in, registar pagamentos) necessitam no máximo 3 cliques a partir do ecrã principal do dashboard autenticado (RNF-03a). A interface web respeita o nível AA das WCAG 2.1: contraste mínimo de 4.5:1 para texto normal, navegação completa por teclado e alternativas textuais para imagens (RNF-03b). Compatibilidade com Chrome, Firefox, Safari e Edge nas versões mais recentes. Suporte mobile: Safari no iOS e Chrome no Android (RNF-10a). |
| **Dicas** | WCAG 2.1 AA é o standard legal de acessibilidade na EU. Contraste 4.5:1 é o mínimo para texto normal — um rácio comum em design. Suporte mobile é obrigatório (RNF-10a). |
| **Referência** | Secção 4.2 — RNF-03a, RNF-03b, RNF-10a |

---

## 19. Alertas Automáticos do Sistema

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Que alertas automáticos o sistema gera e para quem? |
| **Resposta** | O sistema gera dois tipos de alertas automáticos: (1) **Alertas de pagamentos em atraso** — quando o dia do vencimento chega, o sistema identifica utentes com mensalidades em atraso e gera um alerta para o responsável administrativo (RF-23). (2) **Alertas de avaliações expiradas** — o sistema identifica utentes cujas avaliações ultrapassaram o período de validade de 6 meses e gera um alerta para o instrutor (RF-24). |
| **Dicas** | Dois alertas, dois receptores: Responsável Administrativo recebe alertas financeiros; Instrutor recebe alertas sobre avaliações físicas. Ambos são automáticos — não dependem de acção manual. |
| **Referência** | Secção 4.1 — RF-23, RF-24 |

---

## 20. Protecção contra Vulnerabilidades

| Campo | Conteúdo |
| ----- | -------- |
| **Pergunta** | Que medidas de segurança o sistema implementa para protecção contra vulnerabilidades comuns? |
| **Resposta** | Todos os inputs são validados e sanitizados para prevenir injecção SQL e XSS (RNF-07b). Esta é a primeira linha de defesa contra ataques via formulários e URLs. Os logs de auditoria são protegidos ao nível da base de dados e são imutáveis — não é possível alterar ou eliminar registos (RNF-07a). Os dados biométricos e de saúde são encriptados com AES-256 na base de dados (RNF-01d). |
| **Dicas** | Injecção SQL e XSS são as duas vulnerabilidades web mais comuns do OWASP Top 10. A protecção é via validação/sanitização de inputs — não há necessidade dePreparedStatements se todos os inputs forem limpos. |
| **Referência** | Secção 4.2 — RNF-01d, RNF-07a, RNF-07b |