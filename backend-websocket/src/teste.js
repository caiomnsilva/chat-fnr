function constructAddressUrl(cepString) {
    cepString = cepString.replace("/cep ", "");
    return cepString;
}

// Exemplo de uso:
let cepString = "/cep 123123123";
let parsedString = constructAddressUrl(cepString);
console.log(parsedString); // Saída esperada: pe/jaboatão dos guararapes/jose nunes da cunha/548
