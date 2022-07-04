let books = [];


window.addEventListener('load', () => {
  books = JSON.parse(localStorage.getItem('book')) || [], updateUI(books);
  
  $('form').onsubmit = addbook;
  
  $('.pilihan>.form-masukkan').onchange = searchData;
  $('#isCompleted').onclick = (e) => {
    $('form>button').innerText = e.target.checked ? 'Simpan Sebagai Sudah dibaca' : 'Simpan Sebagi Belum dibaca';
  };
  
  $('#tambahBuku').onclick = () => {
    const isEdit  = $('form').id;
    const isShown = !$('.input-data').classList.contains('hide');
    if(isShown && isEdit) {
      if(confirm('Batalkan Edit Data?')) {
        $('.input-data>h3').innerText = 'Inputkan Data';
        $('form').removeAttribute('id');
        $('form').reset();
      }
    } else {
      $('.input-data').classList.toggle('hide');
    }
  };
});


function updateUI(books) {
  const finished   = $('.udah-dibaca'), 
        unfinished = $('.belum-dibaca');
        
  finished.innerHTML = '', unfinished.innerHTML = '';
  
  for(let book of books) {
    let item   = $new('div', { id: book.id, css: ['book'] });
    let judul  = $new('h4', { text: `${book.judul}` });
    let jenis = $new('p', { text: `Penulis: ${book.jenis}` });
    let year   = $new('p', { text: `Tahun: ${book.year}` });
    let group  = $new('button', { css: ['button', 'button-success'], text: `${ book.isCompleted ? 'Belum selesai' : 'Udah dibaca'}`, action: moveGroup });
    let remove = $new('button', { css: ['button', 'button-danger'], text: 'Hapus', action: removebook });
    let edit   = $new('button', { css: ['button', 'button-warning'], text: 'Edit', action: editbook });
    
    [judul, jenis, year, group, remove, edit].forEach(e => {
      item.appendChild(e);
    });
    
    book.isCompleted ? finished.appendChild(item) : unfinished.appendChild(item);
  }
  
  !finished.hasChildNodes() ? finished.innerHTML = 'Belum Ada Data Untuk Ditampilkan' : 0;
  !unfinished.hasChildNodes() ? unfinished.innerHTML = 'Belum Ada Data Untuk Ditampilkan' : 0;
}


function moveGroup(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  books[position].isCompleted = !books[position].isCompleted;
  saveData();
  updateUI(books);
}


function removebook(e) {
  if(confirm('Yakin Akan Dihapus?')) {
    const position = books.findIndex(i => i.id == e.target.parentNode.id);
    books.splice(position, 1);
    saveData();
    updateUI(books);
  }
}


function editbook(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  
  $('#judul').value  = books[position].judul;
  $('#jenis').value = books[position].jenis;
  $('#year').value   = books[position].year;
  $('#isCompleted').checked = books[position].isCompleted;
  
  $('form').id = position;
  
  $('.input-data>h3').innerText = 'Edit Data';
  $('.input-data').classList.remove('hide');
  $('.input-data').scrollIntoView();
  
  $('#judul').focus();
}


function addbook() {
  const position = $('form').id;
  
  let model = {
    id: +new Date(),
    judul: $('#judul').value,
    jenis: $('#jenis').value,
    year: $('#year').value,
    isCompleted: $('#isCompleted').checked
  }
  
  if(position) {
    books[position].judul  = model.judul;
    books[position].jenis = model.jenis;
    books[position].year   = model.year;
    books[position].isCompleted = model.isCompleted;
  } else {
    books.push(model);
  }
  
  saveData();
  updateUI(books);
}


function searchData(e) {
  e = e.target.value;
  
  updateUI(books.filter(book => {
    return book.judul.toLowerCase().includes(e.toLowerCase());
  }));
}


function saveData() {
  localStorage.setItem('book', JSON.stringify(books));
}


function $new(e,a) {
  e = document.createElement(e);
  a.id ? e.id = a.id : 0;
  a.text ? e.innerText = a.text : 0;
  a.action ? e.addEventListener('click', a.action) : 0;
  a.css ? a.css.forEach(css => e.classList.add(css)) : 0;
  return e;
}


function $(e) {
  e = document.querySelectorAll(e);
  return e.length >= 1 ? e[0] : e;
}