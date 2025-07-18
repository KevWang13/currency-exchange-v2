async function fetchCurrencies() {
  const res = await fetch('/currencies');
  const data = await res.json();

  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const tbody = document.querySelector('#currency-table tbody');

  from.innerHTML = '';
  to.innerHTML = '';
  tbody.innerHTML = '';

  data.forEach(cur => {
    const option1 = new Option(`${cur.iso_code} - ${cur.name}`, cur.iso_code);
    const option2 = new Option(`${cur.iso_code} - ${cur.name}`, cur.iso_code);
    from.appendChild(option1);
    to.appendChild(option2);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${cur.flag_url}" alt="${cur.iso_code} flag" style="width:32px;height:20px;"></td>
      <td>${cur.iso_code}</td>
      <td>${cur.name}</td>
      <td>${cur.symbol || ''}</td>
      <td>${cur.country || ''}</td>
    `;
    tbody.appendChild(tr);
  });

  from.value = 'USD';
  to.value = 'EUR';
}

async function convert() {
  const amt = document.getElementById('amount').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  const res = await fetch(`/convert?from=${from}&to=${to}&amount=${amt}`);
  const data = await res.json();

  document.getElementById('result').innerHTML = 
    `${amt} ${from} = <strong>${data.converted.toFixed(2)} ${to}</strong>`;
}

// Switch button functionality
function switchCurrencies() {
  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
}

// Call this on page load
fetchCurrencies();
