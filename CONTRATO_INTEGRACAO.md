# Contrato de integração — Atividade 2 / Central de Chamados

Este contrato deve ser validado entre as equipes antes de publicar a versão integrada. **Os nomes e valores abaixo são propostas de interface; não foram fornecidos pelo projeto BPMN nem pelo dataset real.** Após acordados, não devem ser renomeados isoladamente.

## 1. Dataset do laboratório — equipe Atividade 4

- ID esperado: `ds_laboratorios`.
- Colunas **exatas** esperadas: `codigo`, `nome`, `bloco`, `tecnico_matricula`.
- O zoom usa `displayKey='nome'` e `zoomvalue='codigo'`.
- O Fluig preenche automaticamente `hidden_laboratorio` (código). O callback preenche também `laboratorio_codigo` (código), `laboratorio_bloco` (bloco) e `tecnico_matricula`.
- Remover a seleção deve limpar todos esses campos.
- A equipe da Atividade 4 deve garantir filtragem no servidor por constraints e retorno sem filtro.

## 2. Workflow BPMN — equipe Atividade 1

| Campo de integração | Valores definidos nesta proposta | Quem grava |
| --- | --- | --- |
| `rota_triagem` | `atender`, `peca`, `improcedente`, `devolver` | Formulário JS, ao mudar `triagem_decisao` |
| `rota_autorizacao` | `autorizar`, `negar` | Formulário JS, ao mudar `autorizacao_decisao` |
| `laboratorio_codigo` | Código selecionado no zoom | Formulário JS |
| `situacao_chamado` | A definir com BPMN (por exemplo, `aberto`, `resolvido`, `cancelado`) | Workflow |

**Não se presumem os números das atividades BPMN.** Os gateways devem ler `rota_triagem` e `rota_autorizacao` (ou combinar nomes diferentes com esta equipe). A triagem é uma única etapa humana; `devolver` depende de tarefa de correção criada pela equipe BPMN. Se a equipe definir outro conjunto de valores, alterar HTML, JS e contrato em conjunto.

## 3. Eventos de formulário/processo — equipe Atividade 3

- Controlar etapa/visibilidade/edição **no servidor**, usando os identificadores reais de atividade (`WKNumState` ou equivalente). `etapa_atual` é um campo de interface opcional e **não** uma fonte segura de autorização.
- Aplicar validações de envio no servidor; não impedir salvamento de rascunho.
- `tipo_problema='dano_fisico'`: exigir anexo real do processo.
- `urgencia='alta'`: `descricao_problema` com ao menos 30 caracteres.
- `equipamentos_afetados`: 1+ registros reais de tabela pai-filho; cada `equip_patrimonio___N` deve atender a `^SLG-\d{5}$`; avaliar cada índice retornado pelo Fluig, não supor índices consecutivos.
- `triagem_decisao='improcedente'` ou `'devolver'`: exigir `triagem_justificativa`.
- `autorizacao_decisao='negar'`: exigir `autorizacao_justificativa`.
- Campos de etapas anteriores somente leitura. Não confiar em `readonly`, JS ou campos ocultos como barreiras de segurança.
- Valores das opções são **minúsculos, sem acentos e estáveis**; rótulos podem mudar sem quebrar scripts.

## 4. Integração de câmbio — equipe Atividade 5

| Campo | Uso/observação |
| --- | --- |
| `peca_importada` | `sim` / `nao` |
| `peca_descricao` | Texto da peça |
| `peca_valor_usd` | Número decimal em USD (ponto como separador técnico) |
| `cotacao_usd_brl` | Cotação para registro histórico, gravada por serviço/evento |
| `cotacao_data` | Data/hora retornada pela consulta, formato a pactuar |
| `peca_valor_brl` | Valor convertido, gravado pela integração |
| `cotacao_status` | Estado da chamada (valor a pactuar) |
| `peca_valor_brl_manual` | Valor informado manualmente se serviço falhar |

Os campos automáticos são `readonly` na interface. **Isso não impede gravação por evento de processo no servidor.** O fallback manual deve ter regras de edição/validação definidas pelas equipes 3 e 5.

## 5. Outras convenções

- Tabela pai-filho: `tablename='equipamentos_afetados'`; colunas base `equip_patrimonio`, `equip_tipo`, `equip_descricao`.
- Campos retornam ao Fluig com `name` persistente, inclusive campos de controle.
- Não criar `<input type='file'>` substituindo os anexos nativos do workflow.
- O formulário não publica nem configura o processo; deve ser associado à definição já publicada pela equipe BPMN.
- Responsividade a 390px será testada no **navegador**; a capacidade de edição de pai-filho no aplicativo móvel nativo depende das limitações da versão Fluig (a documentação do modelo antigo informa que pode ser somente consulta).
