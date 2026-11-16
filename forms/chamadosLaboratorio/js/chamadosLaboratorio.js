/*
 * Atividade 2 — Central de Chamados (UNIVASF/Mountain)
 * Frontend do formulário ECM. NÃO substitui os eventos de validação no servidor (Atividade 3).
 * Dependências funcionais no Fluig: wdkAddChild, fnWdkRemoveChild e zoom nativo.
 * Contratos de integração no arquivo CONTRATO_INTEGRACAO.md.
 */
(function (win, doc) {
    'use strict';

    const TABLE_NAME = 'equipamentos_afetados';
    const PATRIMONY_SELECTOR = 'input[name^="equip_patrimonio___"]';

    function element(id) {
        return doc.getElementById(id);
    }

    function setValue(id, value) {
        const field = element(id);
        if (field) field.value = value == null ? '' : String(value);
    }

    function getValue(id) {
        const field = element(id);
        return field ? field.value : '';
    }

    function formatPatrimony(value) {
        const source = String(value || '').toUpperCase();
        // Não inserir prefixo em um campo realmente vazio; assim a exclusão funciona.
        if (!source.trim()) return '';
        const digits = source.replace(/^SLG\s*-?/, '').replace(/\D/g, '').slice(0, 5);
        return 'SLG-' + digits;
    }

    function isPatrimonyField(target) {
        if (!target || target.tagName !== 'INPUT') return false;
        const name = target.getAttribute('name') || '';
        return name === 'equip_patrimonio' || /^equip_patrimonio___\d+$/.test(name);
    }

    function getChildFields() {
        const table = element('tblEquipamentos');
        if (!table) return [];
        // O nome base, sem sufixo, pertence à linha-modelo e NÃO é contado.
        return Array.from(table.querySelectorAll(PATRIMONY_SELECTOR)).filter(function (input) {
            return /^equip_patrimonio___\d+$/.test(input.name || '');
        });
    }

    function refreshEquipmentCounter() {
        const count = getChildFields().length;
        const counter = element('equipamentosContador');
        if (counter) counter.textContent = count + (count === 1 ? ' equipamento' : ' equipamentos');
        setValue('total_equipamentos', count);
        return count;
    }

    function refreshUrgencyHint() {
    	const text = String(getValue('descricao_problema') || '').trim();
        const isHigh = getValue('urgencia') === 'alta';
        const counter = element('contadorDescricao');
        const notice = element('avisoUrgencia');
        if (counter) counter.textContent = text.length + ' caracteres';
        if (notice) {
            notice.classList.toggle('flc-hint-warning', isHigh && text.length < 30);
            notice.textContent = isHigh
                ? 'Urgência alta: ' + text.length + '/30 caracteres mínimos.'
                : 'Para urgência alta, descreva o problema em pelo menos 30 caracteres.';
        }
    }

    function synchronizeGatewayFields() {
        // Preserva o contrato: campos de decisão são strings com valores conhecidos.
        const triage = getValue('triagem_decisao');
        const approval = getValue('autorizacao_decisao');
        setValue('rota_triagem', triage);
        setValue('rota_autorizacao', approval);
    }

    function synchronizeEquipmentHint() {
        const total = refreshEquipmentCounter();
        const button = element('btnAdicionarEquipamento');
        // Visibilidade/edição por etapa é definida por eventos Fluig da Atividade 3.
        if (button) button.setAttribute('aria-label', 'Adicionar equipamento à lista (atualmente ' + total + ')');
    }

    function addEquipment() {
        if (typeof win.wdkAddChild !== 'function') {
            notify('O cadastro pai-filho está disponível somente no formulário publicado no Fluig.');
            return null;
        }
        const index = win.wdkAddChild(TABLE_NAME);
        // O Fluig gera ___indice automaticamente, sem reaproveitar números ao remover.
        const field = element('equip_patrimonio___' + index);
        if (field) {
            field.setAttribute('autocomplete', 'off');
            field.setAttribute('maxlength', '9');
            field.setAttribute('placeholder', 'SLG-00000');
            field.focus();
        }
        synchronizeEquipmentHint();
        return index;
    }

    function removeEquipment(elementToDelete) {
        // NÃO remover tr com .remove(): isto não atualizaria a estrutura Pai x Filho.
        const remover = win.fnWdkRemoveChild || win.wdkRemoveChild;
        if (typeof remover !== 'function') {
            notify('Remoção disponível apenas dentro do Fluig.');
            return;
        }
        remover(elementToDelete);
        synchronizeEquipmentHint();
    }

    function notify(message) {
        if (win.FLUIGC && typeof win.FLUIGC.toast === 'function') {
            win.FLUIGC.toast({title: 'Formulário', message: message, type: 'warning'});
        } else if (typeof win.alert === 'function') {
            win.alert(message);
        }
    }

    function syncSelectedLaboratory(item) {
        if (!item || item.inputId !== 'laboratorio') return;
        const code = item.codigo || '';
        const block = item.bloco || '';
        setValue('hidden_laboratorio', code); // zoomvalue (preenchimento também feito pelo Fluig)
        setValue('laboratorio_codigo', code); // campo consumido pelo mecanismo de atribuição
        setValue('laboratorio_bloco', block);
        setValue('tecnico_matricula', item.tecnico_matricula || '');
    }

    function clearSelectedLaboratory(item) {
        if (!item || item.inputId !== 'laboratorio') return;
        setValue('hidden_laboratorio', '');
        setValue('laboratorio_codigo', '');
        setValue('laboratorio_bloco', '');
        setValue('tecnico_matricula', '');
    }

    function init() {
        const form = element('formChamados');
        if (!form) return;
        doc.addEventListener('input', function (event) {
            if (isPatrimonyField(event.target)) {
                const formatted = formatPatrimony(event.target.value);
                if (event.target.value !== formatted) event.target.value = formatted;
            }
            if (event.target.id === 'descricao_problema') refreshUrgencyHint();
        });
        const urgency = element('urgencia');
        if (urgency) urgency.addEventListener('change', refreshUrgencyHint);
        ['triagem_decisao', 'autorizacao_decisao'].forEach(function (fieldId) {
            const input = element(fieldId);
            if (input) input.addEventListener('change', synchronizeGatewayFields);
        });
        const tbody = element('tbodyEquipamentos');
        if (tbody && typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(synchronizeEquipmentHint);
            observer.observe(tbody, {childList: true, subtree: true});
        }
        // Não apagar valores recuperados pelo Fluig, nem criar linhas sem ação do usuário.
        synchronizeGatewayFields();
        refreshUrgencyHint();
        synchronizeEquipmentHint();
    }

    // Funções globais exigidas pelos callbacks do parser Fluig / atributo onclick.
    win.adicionarEquipamento = addEquipment;
    win.removerEquipamento = removeEquipment;
    win.setSelectedZoomItem = syncSelectedLaboratory;
    win.removedZoomItem = clearSelectedLaboratory;

    // Permite testes automatizados sem impactar o comportamento do Fluig.
    win.ChamadosForm = Object.freeze({
        formatPatrimony: formatPatrimony,
        refreshEquipmentCounter: refreshEquipmentCounter,
        synchronizeGatewayFields: synchronizeGatewayFields
    });

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window, document);
