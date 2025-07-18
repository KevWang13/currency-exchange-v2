async function fetchCurrencies() {
    const res = await fetch('/currencies');
    const data = await res.json();
  
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    const table = document.querySelector('#currency-table tbody');
  
    data.forEach(cur => {
      const option1 = new Option(`${cur.iso_code} - ${cur.name}`, cur.iso_code);
      const option2 = new Option(`${cur.iso_code} - ${cur.name}`, cur.iso_code);
      from.appendChild(option1);
      to.appendChild(option2);
  
      const row = document.createElement('tr');
      row.innerHTML = `<td>${cur.iso_code}</td><td>${cur.name}</td><td>${cur.symbol || ''}</td><td>${cur.country || ''}</td>`;
      table.appendChild(row);
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
  
  fetchCurrencies();
  