//polyfill valueAsDate, toLocaleString, toLocaleDateString
(function(){
    var isDateInvert = (function(){
        var lang = window.navigator.userLanguage || window.navigator.language;
        if (lang.substring(0,2) === "en"){
            return true;
        }
        else{
            return false;
        }
    })();
    
    if (Date.prototype.toLocaleDateString === undefined){
        Date.prototype.toLocaleDateString = function(){
            if (isDateInvert){
                return (this.getUTCMonth() + 1) + "/" + this.getUTCDate() + "/" + this.getFullYear();
            }
            else{
                return this.getUTCDate() + "/" + (this.getUTCMonth() + 1) + "/" + this.getFullYear();
            }
        }
    }
    
    if (Date.prototype.toLocaleString === undefined){
        Date.prototype.toLocaleString = function(){
            return this;
        }
    }
    
    if (Number.prototype.toLocaleString === undefined){
        Number.prototype.toLocaleString = function(){
            try{
                var valueM;
                valueM = this.toString().split(".");
                if (valueM.length === 1){
                    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
                else{
                    return valueM[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + valueM[1].toString().substring(0,2)
                }
            }
            catch(err){
                return this;
            }
        }
    }
    
    var dataProperty = {
        set : function (value) {
            var dia, mes, ano;
            if (value){
                dia = value.getDate().toString();
                if (dia.length === 1){
                    dia = "0" + dia;
                }
                mes = (value.getMonth() + 1).toString();
                if (mes.length === 1){
                    mes = "0" + mes;
                }
                ano = value.getFullYear().toString();

                if (isDateInvert){
                    this.value = mes + "/" + dia + "/" + ano;
                }
                else{
                    this.value = dia + "/" + mes + "/" + ano;
                }
            }
            else{
                this.value = "";
            }
        },
        get : function () {
            var valueV;
            var valueTimeStamp;
            var dia, mes, ano;
            try{
                valueV = this.value.trim().split("/");
                if(valueV.length === 3){
                    if (isDateInvert){
                        dia = valueV[1];
                        mes = valueV[0];
                        ano = valueV[2];    
                    }
                    else{
                        dia = valueV[0];
                        mes = valueV[1];
                        ano = valueV[2];
                    }
                    
                    if (dia.length === 1){
                        dia = "0" + dia;
                    }
                    if (mes.length === 1){
                        mes = "0" + mes;
                    }
                    valueTimeStamp = Date.parse(ano + '-' + mes + '-' + dia);
                    if (isNaN(valueTimeStamp)){
                        return null;
                    }
                    else{
                        return new Date(parseInt(ano), (parseInt(mes) - 1), parseInt(dia));
                    }
                }
                else{
                    return null;
                }
            }
            catch(err){
                return null;
            }
        }
    }
    
    if (HTMLInputElement.prototype.valueAsDate === undefined){
        Object.defineProperty(HTMLInputElement.prototype, 'valueAsDate', dataProperty);
    }
})();