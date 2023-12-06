const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOK_APPS';
const SAVED_EVENT = 'saved-book'

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataBooksFromStorage();
    };
});

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    if (title && author && year) {
        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveDataBooks();
    } else {
        alert('Harap Melengkapi Semua Kolom');
    }
}


function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete,
    }
}

function displayBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;
    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;
    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(bookTitle, bookAuthor, bookYear);
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.append(textContainer);
    bookItem.setAttribute('id', `book-${bookObject.id}`);
    const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        if (bookObject.isComplete) {
            const moveToIncompleteButton = document.createElement('button');
            moveToIncompleteButton.classList.add('orange');
            moveToIncompleteButton.innerText = 'Pindah ke Belum Selesai';
            moveToIncompleteButton.addEventListener('click', function () {
                moveToIncomplete(bookObject.id);
            });
            const removeButton = document.createElement('button');
            removeButton.classList.add('red');
            removeButton.innerText = 'Hapus Buku';
            removeButton.addEventListener('click', function () {
                removeBooks(bookObject.id);
                alert('Jangan lupa baca buku ini lagi yaa...')
            });
            buttonContainer.append(moveToIncompleteButton, removeButton);
        } else {
            const completeButton = document.createElement('button');
            completeButton.classList.add('green');
            completeButton.innerText = 'Selesai dibaca';
            completeButton.addEventListener('click', function () {
                addBooksToComplete(bookObject.id);
            });
            const removeButton = document.createElement('button');
            removeButton.classList.add('red');
            removeButton.innerText = 'Hapus Buku';
            removeButton.addEventListener('click', function () {
                removeBooks(bookObject.id);
                alert('Menghapus buku')
            });
            buttonContainer.append(completeButton, removeButton);
        }
    bookItem.append(buttonContainer);
    return bookItem;
}

document.addEventListener(RENDER_EVENT, function () {
    const incompleteList = document.getElementById('incompleteBookshelfList');
    incompleteList.innerHTML = '';
    const completeList = document.getElementById('completeBookshelfList');
    completeList.innerHtml = '';
    for (const bookItem of books) {
        const bookElement = displayBook(bookItem);
        if (bookItem.isComplete) {
            completeList.append(bookElement)
        } else {
            incompleteList.append(bookElement)
        }
    }
});

function addBooksToComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks();
}

function removeBooks(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks();
}

function moveToIncomplete(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books[bookTarget].isComplete = false;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBooks();
}

function findBook(bookId) {
    for (const bookValue of books) {
        if (bookValue.id === bookId) {
            return bookValue;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (let index = 0; index < books.length; index++) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book-item > h3'); // Corrected the query selector
    for (const book of bookList) {
        if (book.innerText.toLowerCase().includes(searchBook)) {
            book.parentElement.parentElement.style.display = 'block';
        } else {
            book.parentElement.parentElement.style.display = 'none';
        }
    }
});

function saveDataBooks() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
//        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

function loadDataBooksFromStorage() {
    const serializedDataBooks = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedDataBooks);
    if (data !== null) {
        books.length = 0;
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}