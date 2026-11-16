
function validateForm(form) {
    var indices = form.getChildrenIndexes("equipamentos_afetados");
    var formato = /^SLG-[0-9]{5}$/;

    for (var i = 0; i < indices.length; i++) {
        var indice = indices[i];
        var patrimonio = String(
            form.getValue("equip_patrimonio___" + indice) || ""
        ).trim();

        if (!formato.test(patrimonio)) {
            throw "Patrimônio inválido na linha " + (i + 1) +
                  ". Utilize o formato SLG-00000.";
        }
    }
}
