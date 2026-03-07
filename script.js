// const myLibrary = (v = JSON.parse(localStorage.getItem('myBooks'))) ? fromJson(v) : [];

//const cancel = document.getElementById('cancel');


class Books {
    constructor(title, author, isRead = false, isbn = '') {
        this.id = crypto.randomUUID();
        this.isbn = isbn == '' ? 'N/A' : isbn;
        this.title = title;
        this.author = author;
        this.isRead = isRead;
    }

    displayInfo() {
        console.log(`Book title: ${this.title}`);
    }
}

class Book extends Books {
    constructor(title, author, isRead = false, isbn = '') {
        super(title, author, isRead, isbn);
    }

    addToLibrary(newBook = false) {
        if (newBook) {
            const allBooks = BookCatalog.getAllBooks(); // []
            const helper = createElementsHelper();
            const row = document.createElement('tr');
            row.setAttribute('data-id', this.id);
            // Create copy of book object and remove id from copy 
            // to prevent id population on the table
            const copy = { ...this };
            delete copy.id;
            const data = Object.values(copy);
            data.forEach(value => {
                const cell = document.createElement('td');
                helper.addDataToTable(cell, value);
                row.appendChild(cell);
            });
            // table body
            document.querySelector('.books tbody').appendChild(row)
            helper.createActionButtons(row);

            allBooks.push(this);
            BookCatalog.setBooks(allBooks)
            localStorage.setItem('myBooks', JSON.stringify(allBooks));


            if (!JSON.parse(localStorage.getItem('myBooks'))) {
                // push to empty storage or reset system

                //allBooks.push(this);
                //localStorage.setItem('myBooks', JSON.stringify(allBooks));
                BookCatalog.setBooks(allBooks)
            } else {
                //push to existing storage. returns an array of book objects
                const books = getBooks();
                //localStorage.setItem('myBooks', JSON.stringify(books));
                BookCatalog.setBooks(books)
            }
        } else {
            console.log(this);
            const bookCollection = BookCatalog.getAllBooks();

            bookCollection.push(this)


            BookCatalog.setBooks(bookCollection);
        }
    }
}

// Helper class to get and add books to localstorage
class BookCatalog {
    // Returns array
    static getAllBooks() {
        return this.#mapJson(JSON.parse(localStorage.getItem('myBooks'))) ?? [];
    }

    static setBooks(book) {
        console.log(book, 'WTF');

        localStorage.setItem('myBooks', JSON.stringify(book));
    }

    static #mapJson(obj) {
        //console.log('nama');

        //console.log(localStorage.getItem('myBooks'));

        if (obj instanceof Object && Object.keys(obj)) {
            return obj.map((value) => {
                const book = new Book(value.title, value.author, value.isRead, value.isbn);
                book.id = value.id
                return book;
            })
        }
        return null;
    }
}


function createElementsHelper() {
    function createActionButtons(row) {
        const deleteBook = document.createElement('td');
        const editBook = document.createElement('td');

        row.append(deleteBook, editBook);

        deleteBook.setAttribute('class', 'action delete');
        editBook.setAttribute('class', 'action edit');
    }

    function addDataToTable(cell, value) {
        if (typeof value !== 'boolean') {
            cell.textContent = value;
            cell.setAttribute('title', value)
        } else {
            const checkbox = createCheckboxInput(cell, value);
            cell.appendChild(checkbox);
        }
    }

    function createCheckboxInput(cell, checkboxValue) {
        const input = document.createElement('input');
        cell.setAttribute('class', 'action read')
        input.setAttribute('class', 'action isRead')
        input.name = "form__isRead";
        input.type = "checkbox"
        input.checked = checkboxValue;
        return input;
    }

    return { createActionButtons, addDataToTable }
}


function BookController(params) {
    const tableBody = document.querySelector('.books tbody');

    function createDefaultBooks() {
        // Check local storage before creating default books
        //console.log(BookCatalog.getAllBooks());
        console.log(!BookCatalog.getAllBooks().length);


        if (!BookCatalog.getAllBooks().length) {
            const booksToAdd = [
                { title: "1984", author: "George Orwell", isRead: true },
                { title: "To Kill a Mockingbird", author: "Harper Lee" },
                { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", isRead: true, isbn: '978-0-306-40615-7' },
                { title: "The Great Gatsby", author: "F. Scott Fitzgerald" }
            ];

            booksToAdd.forEach(book => {
                //console.log(new Book(book.title, book.author, book.isRead ?? false, book.isbn ?? ''));
                new Book(book.title, book.author, book.isRead ?? false, book.isbn ?? '').addToLibrary();
            });
        }
    }

    function resetSystem() {
        if (BookCatalog.getAllBooks().length <= 0 && tableBody.querySelectorAll('tr').length == 0) {
            if (window.confirm("reset the system?")) {
                localStorage.clear();
                window.location.reload();
            }
        }
    }

    function showBooks() {
        const helper = createElementsHelper();
        BookCatalog.getAllBooks().forEach(book => {
            // Create table row
            const row = tableBody.appendChild(document.createElement('tr'));
            row.setAttribute('data-id', book.id);
            const copy = { ...book };
            delete copy.id;
            //const data = Object.values(copy);

            // iterate through values from current book object (array)
            Object.values(copy).forEach(value => {
                // Create table cells
                let cell = document.createElement('td');
                helper.addDataToTable(cell, value);
                row.appendChild(cell)
            });
            helper.createActionButtons(row);
        });
    }

    return {
        createDefaultBooks,
        resetSystem,
        showBooks,
    }
}

function screenController() {
    const bookController = new BookController()
    bookController.createDefaultBooks();
    bookController.resetSystem();

    const rows = document.querySelector('table tbody');
    const editBtn = document.getElementById('updateBook');
    const addNewBookBtn = document.getElementById('addBook');
    const storeUpdateDialog = document.getElementById('storeUpdateDialog');
    const addBookToLibraryBtn = document.getElementById('addButton');
    const modalForm = document.querySelector('.modal__form');
    const deleteButton = document.getElementById('deleteButton');


    rows.addEventListener('click', function (e) {
        target = e.target;
        elementClass = target.classList.value;
        if (target !== "" && elementClass.includes('action')) {
            const tableRow = target.closest('tr');
            //window.allBooks = getBooks();
            const allBooks = BookCatalog.getAllBooks();

            const bookIndex = allBooks.findIndex((book) => {
                return book.id == tableRow.dataset.id
            })

            const book = allBooks[bookIndex];
            window.dialogData = tableRow;
            window.bookIndex = bookIndex;

            switch (elementClass.substr(7)) {
                case 'delete':
                    document.getElementById('bookInformation').hidden = false;
                    document.getElementById('bookTitle').textContent = book.title;
                    document.getElementById('bookAuthor').textContent = book.author;
                    deleteDialog.showModal();
                    break;
                case 'edit':
                    addNewBookBtn.hidden = true;
                    editBtn.hidden = false;
                    document.getElementById('author').value = book.author
                    document.getElementById('title').value = book.title;
                    document.getElementById('read').checked = book.isRead;
                    document.getElementById('isbn').value = book.isbn == 'N/A' ? '' : book.isbn;
                    storeUpdateDialog.showModal();
                    break;
                case 'isRead':
                    // sets isRead property to true directly on the object
                    book.isRead = target.checked;
                    BookCatalog.setBooks(allBooks);
                    break
                default:
                    break;
            }
        }
    });

    bookController.showBooks();

    // Event Listeners
    addBookToLibraryBtn.addEventListener('click', function (e) {
        document.querySelectorAll(".modal__form input").forEach(element => {
            if (element.type == 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        addNewBookBtn.hidden = false;
        editBtn.hidden = true;
        storeUpdateDialog.showModal();
    });

    modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submittedButton = e.submitter.value;
        let data;
        let book;

        if (submittedButton !== 'cancel') {
            formData = new FormData(this)
            data = Object.fromEntries(formData.entries());
            data.is_read = data.is_read == 'on' ? true : false;
        }

        switch (submittedButton) {
            case 'addBook':
                book = new Book(data.author_name, data.title_name, data.is_read, data.isbn_number);
                book.addToLibrary(true);
                break;
            case 'editBook':
                const books = BookCatalog.getAllBooks();
                book = books[window.bookIndex];
                book.author = data.author_name;
                book.title = data.title_name;
                book.isRead = data.is_read;
                book.isbn = data.isbn_number;

                //localStorage.setItem('myBooks', JSON.stringify(books))
                BookCatalog.setBooks(books);
                window.location.reload();
                break;
        }
        storeUpdateDialog.close();
    })

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        // remove child element (selected row) from document
        const row = window.dialogData;
        row.remove();
        // remove book from myLibrary array
        //const allBooks = window.allBooks;
        const allBooks = BookCatalog.getAllBooks();
        allBooks.splice(window.bookIndex, 1);
        // add myLibrary to local storage
        BookCatalog.setBooks(allBooks);
        //localStorage.setItem('myBooks', JSON.stringify(allBooks));
        resetSystem();
        document.getElementById('deleteDialog').close('');
    })
}

screenController();


// const bookController = new BookController()
// bookController.createDefaultBooks();
// console.log(BookCatalog.getAllBooks());


