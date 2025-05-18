const kmForm = document.getElementById('kmForm');
const recordsTableBody = document.querySelector('#recordsTable tbody');
const clearBtn = document.getElementById('clearBtn');

function loadRecords() {
  return JSON.parse(localStorage.getItem('mobilKmRecords')) || [];
}

function saveRecords(records) {
  localStorage.setItem('mobilKmRecords', JSON.stringify(records));
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function renderRecords() {
  const records = loadRecords();
  recordsTableBody.innerHTML = '';
  if (records.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="7" style="color:#888; text-align:center;">Belum ada data pencatatan</td>';
    recordsTableBody.appendChild(tr);
    return;
  }
  records.forEach(record => {
    const jarak = record.kmAkhir - record.kmAwal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${record.tanggal}</td>
      <td>${record.platNomor}</td>
      <td>${record.jamKeluar}</td>
      <td>${record.jamMasuk}</td>
      <td>${record.kmAwal.toLocaleString('id-ID')}</td>
      <td>${record.kmAkhir.toLocaleString('id-ID')}</td>
      <td>${jarak.toLocaleString('id-ID')}</td>
    `;
    recordsTableBody.appendChild(tr);
  });
}

kmForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const tanggal = kmForm.tanggal.value;
  const platNomor = kmForm.platNomor.value.trim();
  const jamKeluar = kmForm.jamKeluar.value;
  const jamMasuk = kmForm.jamMasuk.value;
  const kmAwal = parseInt(kmForm.kmAwal.value, 10);
  const kmAkhir = parseInt(kmForm.kmAkhir.value, 10);

  if (!tanggal || !platNomor || !jamKeluar || !jamMasuk || isNaN(kmAwal) || isNaN(kmAkhir)) {
    alert('Mohon lengkapi semua data dengan benar.');
    return;
  }

  if (kmAkhir < kmAwal) {
    alert('Kilometer Akhir harus lebih besar atau sama dengan Kilometer Awal.');
    return;
  }

  let keluarMinutes = timeToMinutes(jamKeluar);
  let masukMinutes = timeToMinutes(jamMasuk);

  if (masukMinutes < keluarMinutes) {
    masukMinutes += 24 * 60;
  }

  if (masukMinutes < keluarMinutes) {
    alert('Jam Masuk tidak boleh kurang dari Jam Keluar.');
    return;
  }

  const records = loadRecords();
  records.push({ tanggal, platNomor, jamKeluar, jamMasuk, kmAwal, kmAkhir });
  saveRecords(records);
  renderRecords();
  kmForm.reset();

  // Set Tanggal field to today after reset
  const today = new Date().toISOString().split('T')[0];
  kmForm.tanggal.value = today;
});

clearBtn.addEventListener('click', () => {
  if (confirm('Apakah Anda yakin ingin menghapus semua data pencatatan?')) {
    localStorage.removeItem('mobilKmRecords');
    renderRecords();
  }
});

window.addEventListener('load', () => {
  const today = new Date().toISOString().split('T')[0];
  kmForm.tanggal.value = today;
  renderRecords();
});
