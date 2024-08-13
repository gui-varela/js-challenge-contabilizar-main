const INDICE_PRIMEIRO_DIGITO_VERIFICADOR = 9
const INDICE_SEGUNDO_DIGITO_VERIFICADOR = 10

const validarEntradaDeDados = (lancamento) => {
   const erros = []

   if (!lancamento.cpf || !lancamento.valor) {
      erros.push("Preencha todos os campos para registrar o lançamento")
   }

   if (isNaN(lancamento.cpf)) {
      erros.push("O CPF só aceita caracteres numéricos")
   }

   if (lancamento.cpf && !isNaN(lancamento.cpf)) {
      const cpfValido = validarDigitosVerificadores(lancamento.cpf)

      if (!cpfValido) {
         erros.push("Insira um CPF válido")
      }

      if (lancamento.cpf.length != 11) {
         erros.push("O CPF deve ter exatamente 11 caracteres numéricos")
      }
   }

   if (isNaN(lancamento.valor)) {
      erros.push("O valor deve ser um número")
   } else {
      const valorParaFloat = parseFloat(lancamento.valor)
   
      if (valorParaFloat > 15000 || valorParaFloat < -2000) {
         erros.push("O valor deve estar entre -2.000,00 e 15.000,00")
      }
   }

   return erros.length > 0 ? erros.map(erro => `\n- ${erro}`) : null
}

const recuperarSaldosPorConta = (lancamentos) => {
   if (!lancamentos || lancamentos.length === 0) {
      return []
   }

   const saldosPorCPF = agruparSaldosPorCPF(lancamentos)
   const saldosTipados = saldosPorCPF.map(registro => {
      return {
         cpf: registro.cpf, 
         valor: registro.valor
      }
   })

   return saldosTipados
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   const lancamentosDaConta = lancamentos.filter(lancamento => lancamento.cpf === cpf)

   if (!lancamentosDaConta || lancamentosDaConta.length === 0) {
      return []
   }

   if (lancamentosDaConta.length === 1) {
      const unicoLancamento = {cpf: lancamentosDaConta[0].cpf, valor: lancamentosDaConta[0].valor}
      return [unicoLancamento, unicoLancamento]
   }

   const lancamentosOrdenadosPorValor = lancamentosDaConta.sort((a,b) => a.valor - b.valor)

   const ultimoIndice = lancamentosDaConta.length - 1

   return [lancamentosOrdenadosPorValor[0], lancamentosOrdenadosPorValor[ultimoIndice]]
}

const recuperarMaioresSaldos = (lancamentos) => {
   const saldosPorCPF = agruparSaldosPorCPF(lancamentos)

   const saldosTipados = saldosPorCPF.map(registro => {
      return {
         cpf: registro.cpf, 
         valor: registro.valor
      }
   })

   const topTresMaioresSaldos = saldosTipados
      .sort((a,b) => b.valor - a.valor)
      .slice(0, 3)

   return topTresMaioresSaldos
}

const recuperarMaioresMedias = (lancamentos) => {
   if (!lancamentos || lancamentos.length === 0) {
      return []
   }
   
   const saldosPorCPF = agruparSaldosPorCPF(lancamentos)

   const mediasTransacoesPorCPF = saldosPorCPF.map(registro => {
      return {
         cpf: registro.cpf,
         valor: registro.valor / registro.totalTransacoes
      }
   })

   const topTresMedias = mediasTransacoesPorCPF
      .sort((a,b) => b.valor - a.valor)
      .slice(0, 3)

   return topTresMedias
}

const agruparSaldosPorCPF = (lancamentos) => {
   const saldosPorCPF = []
   
   lancamentos.forEach((lancamento) => {
      const saldoJaRegistrado = saldosPorCPF.find(saldo => saldo.cpf === lancamento.cpf)

      if (saldoJaRegistrado) {
         const inidiceRegistro = saldosPorCPF.indexOf(saldoJaRegistrado)

         saldosPorCPF[inidiceRegistro].valor += lancamento.valor
         saldosPorCPF[inidiceRegistro].totalTransacoes += 1
      } else {
         saldosPorCPF.push({cpf: lancamento.cpf, valor: lancamento.valor, totalTransacoes: 1})
      }
   })

   return saldosPorCPF
}

const validarDigitosVerificadores = (cpf) => {
   const cpfTransformadoEmArray = cpf.split('')
   const novePrimeirosDigitos = cpfTransformadoEmArray.slice(0,9)

   const primeiroDigitoVerificadorCalculado = calculaPrimeiroDigitoVerificador(novePrimeirosDigitos)
   const segundoDigitoVerificadorCalculado = calculaSegundoDigitoVerificador(novePrimeirosDigitos, primeiroDigitoVerificadorCalculado)

   const cpfValido = (
      primeiroDigitoVerificadorCalculado === cpf[INDICE_PRIMEIRO_DIGITO_VERIFICADOR] && 
      segundoDigitoVerificadorCalculado === cpf[INDICE_SEGUNDO_DIGITO_VERIFICADOR]
   )

   return cpfValido
}

/**
 * Para calcular o primeiro dígito verificador do CPF, é necessario:
 * - Obter os primeiros 9 dígitos do CPF
 * - Multiplicar o primeiro dígito por 10, o segundo por 9 e assim por diante, até multiplicar o nono por 2
 * - Somar o resultado dessas multiplicações
 * - Dividir essa soma por 11 e descobrir o resto
 * - Se o resto for menor que 2, o dígito verificador é 0 (zero)
 * - Senão subtrair este resto de 11. Este será o valor do dígito verificador
 * 
 * @param   {String[]} novePrimeirosDigitosCPF  Parâmetro obrigatório
 * @returns {String}
 */
const calculaPrimeiroDigitoVerificador = (novePrimeirosDigitosCPF) => {
   const valorInicial = 0

   const somatorio = novePrimeirosDigitosCPF.reduce(
      (accumulator, currentValue, index) => accumulator + ((10 - index) * parseInt(currentValue)),
      valorInicial
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
 * - Se o resto for menor que 2, o dígito verificador é 0 (zero)
 * - Senão subtrair este resto de 11. Este será o valor do dígito verificador
 * 
 * @param   {String[]} novePrimeirosDigitosCPF  Parâmetro obrigatório
 * @returns {String}
 */
const calculaSegundoDigitoVerificador = (novePrimeirosDigitosCPF, primeiroDigitoVerificador) => {
   const novePrimeirosComPrimeiroDigitoVerificador = [...novePrimeirosDigitosCPF, primeiroDigitoVerificador]
   
   const valorInicial = 0

   const somatorio = novePrimeirosComPrimeiroDigitoVerificador.reduce(
      (accumulator, currentValue, index) => accumulator + ((11 - index) * parseInt(currentValue)),
      valorInicial
   )

   const resto = somatorio % 11

   if (resto < 2) {
      return "0"
   }

   return (11 - resto).toString()
}