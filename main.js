const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener(RENDER_EVENT, function () {
    console.log(bookshelf);
    const uncompletedBOOKSHELFList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKSHELFList.innerHTML = '';

    for (const bookshelfItem of bookshelf) {
        const bookshelfElement = makeBookshelf(bookshelfItem);
        uncompletedBOOKSHELFList.append(bookshelfElement);
    }
});

//menambahkan event listener yang akan menjalankan kode ketika semua element HTML sudah dimuat
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault(); //mencegah data dimuat ulang
        addBookshelf(); //memanggil fungsi addBookshelf
    });

});

//Membuat fungsi addBookshelf untuk memindahkan daftar buku ke rak
function addBookshelf() {
    const title = document.getElementById('inputBookTitle').value; //mengambil judul buku dari nilai input
    const author = document.getElementById('inputBookAuthor').value; //mengambil nama penulis buku dari nilai input
    const year = document.getElementById('inputBookYear').value; //mengambil tahun buku dari nilai input

    const generatedID = generateId();
    const bookshelfObject = generateBookshelfObject(generatedID, title, author, year, false);
    bookshelf.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generateBookshelfObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makeBookshelf(bookshelfObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookshelfObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookshelfObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookshelfObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `bookshelf-${bookshelfObject.id}`);

    return container;
}