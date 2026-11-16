# UNIVASF — Desafios Fluig — Atividade 2 (ECM)

**Escopo**: somente o formulário de solicitação da Central de Chamados do Laboratório. As Atividades 1, 3, 4 e 5 são responsabilidade de outras equipes.

## Arquivos para implantar no Fluig

```
forms/chamadosLaboratorio/
├── chamadosLaboratorio.html
├── css/chamadosLaboratorio.css
└── js/chamadosLaboratorio.js
```

A pasta `preview/` é uma **simulação local** para inspecionar o layout e verificar interações básicas sem servidor Fluig. Não deve ser publicada no projeto. Ela **não substitui** um teste integrado com o Fluig.

## Procedimento de instalação

1. Abra o projeto Fluig no **Fluig Studio** e confirme a conexão com o ambiente de estudo.
2. Em `forms`, crie/abra uma definição de formulário `chamadosLaboratorio` pelo próprio Studio, ou importe os arquivos para a definição correspondente.
3. Mantenha o HTML, o CSS e o JavaScript juntos na definição, respeitando as referências relativas `css/...` e `js/...`. Verifique se sua versão do Studio exporta os arquivos estáticos para a definição como esperado; se necessário, ajuste o caminho de recursos de acordo com o mecanismo de publicação do ambiente.
4. Publique a definição de formulário, associe-a ao processo BPMN criado pela outra equipe e teste uma nova solicitação.
5. Solicite o ID e as colunas exatas do dataset da equipe 4 e ajuste o `data-zoom` se forem diferentes de `ds_laboratorios` e das colunas pactuadas.
6. Faça os testes de `testes/roteiro_aceite.md` no Fluig real e guarde prints de abertura, triagem, autorização e execução.
7. Encaminhe à equipe 3 os nomes dos campos e os valores de decisão descritos em `CONTRATO_INTEGRACAO.md`.

## Requisitos que o código implementa

- Um formulário com **4 seções** e mais de 16 campos persistíveis (textos, textarea, data, número, seleção e sim/não por select).
- HTML com `fluig-style-guide`; CSS próprio responsivo; nenhum CDN externo.
- Campo Zoom `laboratorio` com `zoomvalue` e callbacks `setSelectedZoomItem` e `removedZoomItem`.
- Tabela pai-filho nativa `equipamentos_afetados` com 3 campos e funções `wdkAddChild` / `fnWdkRemoveChild`.
- Formatação interativa de patrimônio `SLG-00000` (a **validação obrigatória no servidor** cabe à equipe 3).
- Campos ocultos para código selecionado, roteamento BPMN e quantidade de equipamentos.
- Preservação dos nomes de campos e índices controlados pelo próprio Fluig; nenhum armazenamento local de chamados.

## Limitações e pendências transparentes

- **Não foi realizado teste dentro do ambiente TOTVS**, pois não há credenciais/servidor neste projeto. A persistência real e o Zoom precisam ser comprovados depois da publicação.
- `ds_laboratorios` é um **ID proposto**. O Zoom somente funcionará após existir o dataset com as colunas acordadas; a prévia usa laboratórios fictícios exclusivamente para demonstração.
- As regras de campo visível, editável e validação de envio/rascunho no servidor são da Atividade 3.
- Processamento de anexos é feito pela **aba nativa Anexos** do workflow; verificação de anexo obrigatório é da Atividade 3.
- Cotação externa e autopreenchimento real dependem da Atividade 5.
- Os identificadores BPMN ainda precisam ser confirmados com a equipe 1.

## Documentação consultada

- TOTVS: [Campo de pesquisa (Zoom)](https://tdn-homolog.totvs.com/pages/releaseview.action?pageId=872686733)
- TOTVS: [Personalização de formulários e Pai x Filho](https://tdn-homolog.totvs.com/pages/releaseview.action?pageId=668198714)
- TOTVS: [Remoção de registros pai-filho](https://centraldeatendimento.totvs.com/hc/pt-br/articles/27663828251799-Fluig-Plataforma-FORM-Como-utilizar-a-fun%C3%A7%C3%A3o-fnWdkRemoveChild-para-apagar-registros-da-tabela-filha)
- TOTVS: [Bibliotecas locais do Style Guide](https://centraldeatendimento.totvs.com/hc/pt-br/articles/27662921666839-Fluig-Plataforma-DES-Erro-ao-buscar-bibliotecas-dispon%C3%ADveis-no-Style-Guide)
