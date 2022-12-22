const FristChosserCoinEl = document.querySelector('[data-js="currency-one"]');
const SecondChosserCoinEl = document.querySelector('[data-js="currency-two"]');
const ShowCovetedValueEl = document.querySelector('[data-js="converted-value"]');
const ShowCovetedValueForOneEl = document.querySelector('[data-js="conversion-precision"]');
const CounterTimes = document.querySelector('[data-js="currency-one-times"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]');


let currencyExtengedRate = {};

const getUrl = (url) => {
   return `https://v6.exchangerate-api.com/v6/d839069924c95a5f9d53be62/latest/${url}`;
}

const ShowErroe = (err) => {
   const div = document.createElement('div');
   const button = document.createElement('button');

   div.textContent = err.message;
   div.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show");
   div.setAttribute("role", "alert");

   button.classList.add('btn-close')
   button.setAttribute('type', 'button');
   button.setAttribute('aria-label', 'Close');

   button.addEventListener('click', () => {
      div.remove();
   })

   div.appendChild(button);
   currenciesEl.insertAdjacentElement('afterend', div);
}


const getError = errorType => ({
   'unsupported-code': 'A moeda não existe em nosso banco de dados!',
   'malformed-request': 'A estrutura está sendo declarada de maneira errada!',
   'invalid-key': 'Chave da api não é valida!',
   'inactive-account': 'Seu endereço de email não está confirmado!',
   'quota-reached': 'Voçẽ atigiu o maximo de requests da api!'
})[errorType] || 'Não foi possivel acessar a api!'


const getExtengedRate = async (url) => {
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Sua conexão falhou, não foi possivel obter as informações.');

      const json = await response.json();
      if (json.result === "error") throw new Error(getError(json['error-type']));

      return json;
   } catch (err) {
      if (err)
         ShowErroe(err);
   }
};


const StartAplication = async () => {
   const getRequest = { ...(await getExtengedRate(getUrl('USD'))) };

   currencyExtengedRate = await getRequest;

   if (currencyExtengedRate.conversion_rates) {
      const getOptions = currencySelect => Object.keys(currencyExtengedRate.conversion_rates)
         .map(option => `<option ${option === currencySelect ? 'selected' : ''}>${option}</option>`)
         .join('');

      FristChosserCoinEl.innerHTML = getOptions('USD');
      SecondChosserCoinEl.innerHTML = getOptions('BRL');

      ShowCovetedValueEl.textContent = (currencyExtengedRate.conversion_rates.BRL).toFixed(2);
      ShowCovetedValueForOneEl.textContent = `1 USD = ${(currencyExtengedRate.conversion_rates.BRL).toFixed(2)} BRL`;
   }
}

CounterTimes.addEventListener('input', ({ target }) => {
   ShowCovetedValueEl.textContent = (target.value * currencyExtengedRate.conversion_rates[SecondChosserCoinEl.value]).toFixed(2);
})


const updatedValues = () => {
   ShowCovetedValueEl.textContent = CounterTimes.value * currencyExtengedRate.conversion_rates[SecondChosserCoinEl.value].toFixed(2);
   ShowCovetedValueForOneEl.textContent = `1 ${FristChosserCoinEl.value} = ${currencyExtengedRate.conversion_rates[SecondChosserCoinEl.value].toFixed(2)} ${SecondChosserCoinEl.value}`
}


SecondChosserCoinEl.addEventListener('input', () => {
   updatedValues();
});

FristChosserCoinEl.addEventListener('input', async ({ target }) => {
   const getRequest = { ...(await getExtengedRate(getUrl(target.value))) };
   currencyExtengedRate = await getRequest;

   if (currencyExtengedRate.conversion_rates) {
      updatedValues();
   }
});

StartAplication();

