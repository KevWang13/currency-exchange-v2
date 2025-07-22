const responseBox = document.getElementById("response");

function showResponse(data) {
  responseBox.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

async function getCurrencies() {
  const iso = document.getElementById("get-iso").value.trim();
  const url = iso ? `/currencies?iso_code=${iso}` : `/currencies`;
  const res = await fetch(url);
  const data = await res.json();
  showResponse(data);
}

async function addCurrency() {
  const body = {
    iso_code: document.getElementById("post-iso").value.trim(),
    name: document.getElementById("post-name").value.trim(),
    symbol: document.getElementById("post-symbol").value.trim(),
    country: document.getElementById("post-country").value.trim(),
    flag_url: document.getElementById("post-flag").value.trim()
  };
  const res = await fetch('/currencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  showResponse(text);
}

async function disableCurrency() {
  const iso = document.getElementById("del-iso").value.trim();
  const res = await fetch(`/currencies/delete?iso_code=${iso}`);
  const text = await res.text();
  showResponse(text);
}

async function updateCurrency() {
  const iso = document.getElementById("upd-iso").value.trim();
  const payload = {
    iso_code: iso,
    name: document.getElementById("upd-name").value.trim() || undefined,
    symbol: document.getElementById("upd-symbol").value.trim() || undefined,
    country: document.getElementById("upd-country").value.trim() || undefined,
    flag_url: document.getElementById("upd-flag").value.trim() || undefined,
    is_active: document.getElementById("upd-active").value.trim()
  };

  if (payload.is_active !== '') {
    payload.is_active = payload.is_active === '1' ? 1 : 0;
  } else {
    delete payload.is_active;
  }

  const res = await fetch('/currencies/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  showResponse(text);
}
