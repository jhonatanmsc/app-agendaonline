export const parseMoney = value => {
    if (value.length >= 2){
        value = value.replaceAll(".", "").replaceAll(",", "");
        let rawValue = value.substring(0, value.length - 2) + '.' + value.substring(value.length, value.length-2);
        let rawNumber = parseFloat(rawValue);
        return rawNumber.toLocaleString('pt-br', {minimumFractionDigits: 2});
    } else {
        return value;
    }
}
