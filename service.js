const validarEntradaDeDados = (lancamento) => {
   const cpfValido = verificarDigitosVerificadores(lancamento.cpf)

   if (!cpfValido) {
      return "insira um cpf valido"
   }

   return null
}

const recuperarSaldosPorConta = (lancamentos) => {
   return []
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   return []
}

const recuperarMaioresSaldos = (lancamentos) => {
   return []
}

const recuperarMaioresMedias = (lancamentos) => {
    return []
}

const validarCPF = (cpf) => {
   if (isNaN(cpf)) {
      return "O CPF só aceita caracteres numéricos"
   }


}

const verificarDigitosVerificadores = (cpf) => {
   const cpfTransformadoEmArray = cpf.split('')
   const novePrimeirosDigitos = cpfTransformadoEmArray.slice(0,9)

   const primeiroDigitoVerificadorValido = calculaPrimeiroDigitoVerificador(novePrimeirosDigitos) === cpf[9]
   const segundoDigitoVerificadorValido = calculaSegundoDigitoVerificador(novePrimeirosDigitos) === cpf[10]

   return primeiroDigitoVerificadorValido && segundoDigitoVerificadorValido
}

/**
 * Para calcular o primeiro dígito verificador do CPF, é necessario:
 * - Obter os primeiros 9 dígitos do CPF
 * - Multiplicar o primeiro dígito por 10, o segundo por 9 e assim por diante, até multiplicar o nono por 2
 * - Somar o resultado dessas multiplicações
 * - Dividir essa soma por 11 e descobrir o resto
 * - Se o resto acima for menor que 2, o dígito verificador é 0 (zero)
 * - Senão subtrair este resto de 11. Este será o valor do dígito verificador
 * 
 * @param   {String[]} novePrimeirosDigitosCPF  Parâmetro obrigatório
 * @returns {String}
 */
const calculaPrimeiroDigitoVerificador = (novePrimeirosDigitosCPF) => {
   const somatorio = novePrimeirosDigitosCPF.reduce(
      (accumulator, currentValue, index) => accumulator + ((10 - index) * parseInt(currentValue)),
      0
   )

   const resto = somatorio % 11

   if (resto < 2) {
      return "0"
   }

   return (11 - resto).toString()
}

/**
 * Para calcular o segundo dígito verificador do CPF, é necessario:
 * - Obter os primeiros 9 dígitos do CPF mais o primeiro dígito verificador
 * - Multiplicar o primeiro dígito por 11, o segundo por 10 e assim por diante, até multiplicar o décimo (que é o dígito verificador) por 2
 * - Somar o resultado dessas multiplicações
 * - Dividir essa soma por 11 e descobrir o resto
 * - Se o resto acima for menor que 2, o dígito verificador é 0 (zero)
 * - Senão subtrair este resto de 11. Este será o valor do dígito verificador
 * 
 * @param   {String[]} novePrimeirosDigitosCPF  Parâmetro obrigatório
 * @returns {String}
 */
const calculaSegundoDigitoVerificador = (novePrimeirosDigitosCPF) => {
   const primeiroDigitoVerificador = calculaPrimeiroDigitoVerificador(novePrimeirosDigitosCPF)
   const novePrimeirosComPrimeiroDigitoVerificador = [...novePrimeirosDigitosCPF, primeiroDigitoVerificador]
   
   const somatorio = novePrimeirosComPrimeiroDigitoVerificador.reduce(
      (accumulator, currentValue, index) => accumulator + ((11 - index) * parseInt(currentValue)),
      0
   );

   const resto = somatorio % 11

   if (resto < 2) {
      return "0"
   }

   return (11 - resto).toString()
}