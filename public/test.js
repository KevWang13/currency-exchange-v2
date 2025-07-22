// Helper: show response in the pre#response element
function showResponse(data) {
    const pre = document.getElementById('response');
    pre.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }
  
  // Get token from localStorage safely
  function getToken() {
    return localStorage.getItem('token') || null;
  }
  
  // GET /users — your backend has no GET /users route, so simulate or create a simple dummy response
  async function getUsers() {
    try {
      const res = await fetch('/users');
      if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      showResponse(data);
    } catch (error) {
      showResponse(`Error: ${error.message}`);
    }
  }
//   async function getUsers() {
//     try {
//       // If you add a GET /users route on backend, uncomment below:
//       // const res = await fetch('/users');
//       // if (!res.ok) throw new Error(await res.text());
//       // const json = await res.json();
  
//       // Dummy fallback:
//       const json = { message: 'GET /users not implemented on server' };
//       showResponse(json);
//     } catch (err) {
//       showResponse({ error: err.message });
//     }
//   }
  
  // POST /users/register
  async function register() {
    try {
      const body = { username: 'joe', email: 'joe@x.com', password: 'pass' };
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const text = await res.text();
      showResponse(text);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  // On page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      document.getElementById('welcome-msg').textContent = 'Welcome, guest!';
    } else {
      // Optionally decode JWT or fetch user info to get username
      // For simplicity, store username in localStorage after login
      const username = localStorage.getItem('username') || 'User';
      document.getElementById('welcome-msg').textContent = `Welcome, ${username}!`;
    }
  });

  async function adminLogin() {
    try {
      const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'adminpass' }) // Replace with your admin password
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        showResponse(`Admin login failed: ${errorText}`);
        return;
      }
  
      const { token } = await res.json();
      localStorage.setItem('token', token);
  
      // Decode JWT payload to get username for welcome message
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
  
      document.getElementById('welcome-msg').textContent = `Welcome, ${payload.username || 'Admin'}`;
  
      showResponse('Admin logged in');
    } catch (err) {
      showResponse(`Admin login failed: ${err.message}`);
    }
  }
  
  
  // POST /users/login
  async function login() {
    const res = await fetch('/users/login', {
      method:'POST', 
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ username:'joe', password:'pass' })
    });
    const { token } = await res.json();
    localStorage.setItem('token', token);
  
    // Fetch user profile to get username
    const profileRes = await fetch('/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profile = await profileRes.json();
  
    document.getElementById('welcome-msg').textContent = `Welcome, ${profile.username || 'User'}`;
  
    showResponse('Logged in');
  }
  
  
//   async function login() {
//     try {
//       const res = await fetch('/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: 'joe', password: 'pass' })
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const { token } = await res.json();
//       localStorage.setItem('token', token);
//       showResponse('Logged in successfully');
//     } catch (err) {
//       showResponse({ error: err.message });
//     }
//   }
  
  // GET /watchlist (auth required)
  async function getWatchlist() {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found. Please login first.');
  
      const res = await fetch('/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  
  // POST /rates/reserve (auth required)
  async function reserveRate() {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found. Please login first.');
  
      const body = { from: 'USD', to: 'EUR', amount: 100, duration: 5 };
      const res = await fetch('/rates/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  
  // GET /currencies with optional ISO filter
  async function getCurrencies() {
    try {
      const iso = document.getElementById('get-iso').value.trim();
      const url = iso ? `/currencies?iso=${encodeURIComponent(iso.toUpperCase())}` : '/currencies';
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  
  // POST /currencies (admin auth required)
  async function addCurrency() {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found. Please login first.');
  
      const body = {
        iso_code: document.getElementById('post-iso').value.trim().toUpperCase(),
        name: document.getElementById('post-name').value.trim(),
        symbol: document.getElementById('post-symbol').value.trim(),
        country: document.getElementById('post-country').value.trim(),
        flag_url: document.getElementById('post-flag').value.trim()
      };
      const res = await fetch('/currencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  
  // GET /currencies/delete?iso=XXX (admin auth required)
  async function disableCurrency() {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found. Please login first.');
  
      const iso = document.getElementById('del-iso').value.trim().toUpperCase();
      if (!iso) throw new Error('Please provide ISO code to disable');
  
      const url = `/currencies/${iso}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  
  // PATCH /currencies/:iso (admin auth required)
  async function updateCurrency() {
    try {
      const token = getToken();
      if (!token) throw new Error('No token found. Please login first.');
  
      const iso = document.getElementById('upd-iso').value.trim().toUpperCase();
      if (!iso) throw new Error('Please provide ISO code to update');
  
      const body = {
        name: document.getElementById('upd-name').value.trim(),
        symbol: document.getElementById('upd-symbol').value.trim(),
        country: document.getElementById('upd-country').value.trim(),
        flag_url: document.getElementById('upd-flag').value.trim(),
        is_active: document.getElementById('upd-active').value.trim()
      };
  
      // Remove empty values so you don't overwrite with blanks
      Object.keys(body).forEach(key => {
        if (body[key] === '') delete body[key];
      });
  
      const res = await fetch(`/currencies/${iso}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      showResponse(json);
    } catch (err) {
      showResponse({ error: err.message });
    }
  }
  

  // Fetch currency data by ISO when ISO input loses focus
async function fetchCurrency() {
    const isoInput = document.getElementById('upd-iso');
    const iso = isoInput.value.trim().toUpperCase();
    if (!iso) return;
  
    try {
      const res = await fetch(`/currencies/${iso}`);
      if (!res.ok) {
        alert(`Currency ${iso} not found.`);
        clearUpdateFields();
        return;
      }
      const data = await res.json();
  
      document.getElementById('upd-name').value = data.name || '';
      document.getElementById('upd-symbol').value = data.symbol || '';
      document.getElementById('upd-country').value = data.country || '';
      document.getElementById('upd-flag').value = data.flag_url || '';
      document.getElementById('upd-active').value = data.is_active ? '1' : '0';
  
      ['upd-name', 'upd-symbol', 'upd-country', 'upd-flag', 'upd-active'].forEach(id => {
        document.getElementById(id).disabled = false;
      });
    } catch (err) {
      alert('Failed to fetch currency info.');
      clearUpdateFields();
    }
  }
  
  function clearUpdateFields() {
    ['upd-name', 'upd-symbol', 'upd-country', 'upd-flag', 'upd-active'].forEach(id => {
      const el = document.getElementById(id);
      el.value = '';
      el.disabled = true;
    });
  }
  
  // Send update request
  async function updateCurrency() {
    const iso = document.getElementById('upd-iso').value.trim().toUpperCase();
    if (!iso) {
      alert('Please enter ISO code');
      return;
    }
  
    const body = {
      name: document.getElementById('upd-name').value.trim(),
      symbol: document.getElementById('upd-symbol').value.trim(),
      country: document.getElementById('upd-country').value.trim(),
      flag_url: document.getElementById('upd-flag').value.trim(),
      is_active: parseInt(document.getElementById('upd-active').value, 10),
    };
  
    try {
      const res = await fetch('/currencies/' + iso, {
        method: 'PATCH',  // or 'POST' depending on your backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // if required
        },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        const err = await res.text();
        alert('Update failed: ' + err);
        return;
      }
      alert('Currency updated successfully!');
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  }
  
  async function fetchCurrencies() {
    const res = await fetch('/currencies');
    const data = await res.json();
  
    // Check if any inactive currencies (assuming backend shouldn't send them)
    const inactive = data.filter(c => c.is_active === 0);
    if (inactive.length > 0) {
      alert('Warning: Some inactive currencies were loaded!');
      console.warn('Inactive currencies:', inactive);
    }
  
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
  