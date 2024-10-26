const STORAGE_KEY = 'BOOKSHELF_APPS';

function loadBooks() {
    const booksJSON = localStorage.getItem(STORAGE_KEY);
    return booksJSON ? JSON.parse(booksJSON) : [];
}

function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateId() {
    return +new Date();
}

function addBook() {
    const titleInput = document.getElementById('bookFormTitle');
    const authorInput = document.getElementById('bookFormAuthor');
    const yearInput = document.getElementById('bookFormYear');
    const isCompleteInput = document.getElementById('bookFormIsComplete');
    
    const selectedRating = document.querySelector('input[name="stars"]:checked');
    const rating = selectedRating ? parseInt(selectedRating.value) : 0;
    
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = yearInput.value;
    const isComplete = isCompleteInput.checked;
    
    if (!title || !author || !year) {
        alert('Semua field harus diisi!');
        return;
    }
    
    const book = {
        id: generateId(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: isComplete,
        rating: rating
    };
    
    const books = loadBooks();
    books.push(book);
    saveBooks(books);
    
    updateBookshelf();
    resetForm();
}

function resetForm() {
    const form = document.getElementById('bookForm');
    form.reset();
}

function updateBookshelf() {
    const books = loadBooks();
    
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    
    const incompleteExample = incompleteBookList.querySelector('[data-testid="bookItem"]');
    const completeExample = completeBookList.querySelector('[data-testid="bookItem"]');
    
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    
    if (incompleteExample) {
        incompleteExample.style.display = 'none';
        incompleteBookList.appendChild(incompleteExample);
    }
    
    if (completeExample) {
        completeExample.style.display = 'none';
        completeBookList.appendChild(completeExample);
    }
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    
    let starsHtml = '<div class="container stars-display">';
    starsHtml += '<div class="container__items">';
    
    for (let i = 5; i >= 1; i--) {
        const isActive = i <= (book.rating || 0) ? ' active' : '';
        starsHtml += `
            <div class="star${isActive}">
                <div class="star-stroke">
                    <div class="star-fill"></div>
                </div>
            </div>
        `;
    }
    
    starsHtml += '</div></div>';
    
    bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        ${starsHtml}
        <div>
            <button data-testid="bookItemIsCompleteButton">
                ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
            </button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
    `;
    
    const toggleButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    
    toggleButton.onclick = () => toggleBookStatus(book.id);
    deleteButton.onclick = () => deleteBook(book.id);
    
    return bookElement;
}

function toggleBookStatus(bookId) {
    const books = loadBooks();
    const bookIndex = books.findIndex(book => book.id == bookId);
    
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        saveBooks(books);
        updateBookshelf();
    }
}

function deleteBook(bookId) {
    const confirmed = confirm('Apakah anda yakin ingin menghapus buku ini?');
    if (confirmed) {
        const books = loadBooks();
        const updatedBooks = books.filter(book => book.id != bookId);
        saveBooks(updatedBooks);
        updateBookshelf();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addBook();
        });
    }
    
    const searchForm = document.getElementById('searchBook');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            searchBooks();
        });
    }
    updateBookshelf();
});

function searchBooks(e) {
    if (e) e.preventDefault();
    
    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    const books = loadBooks();
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(filteredBooks);
}

function displaySearchResults(books) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

function createStarRatingHTML(rating) {
    const totalStars = 5;
    let starsHTML = '<div class="stars-display">';
    
    for (let i = 1; i <= totalStars; i++) {
        const starClass = i <= rating ? 'star-filled' : 'star-empty';
        starsHTML += `
            <div class="star ${starClass}">
                <div class="star-stroke">
                    <div class="star-fill"></div>
                </div>
            </div>
        `;
    }
    
    starsHTML += '</div>';
    return starsHTML;
}