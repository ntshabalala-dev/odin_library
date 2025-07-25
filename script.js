const myLibrary = (v = JSON.parse(localStorage.getItem('myBooks'))) ? fromJson(v) : [];
const tableBody = document.querySelector('.books tbody');
const editBtn = document.getElementById('updateBook');
const addNewBookBtn = document.getElementById('addBook');
const storeUpdateDialog = document.getElementById('storeUpdateDialog');
const addBookToLibraryBtn = document.getElementById('addButton');
const cancel = document.getElementById('cancel');
const modalForm = document.querySelector('.modal__form');

function Books(title, author, isRead = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.isRead = isRead;

    let i = 1;
    console.log(++i);
    
}

Books.prototype.addToLibrary = function (newBook = false) {
    if (newBook) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', this.id);
        const data = Object.values(this);
        data.forEach(value => {
            const cell = document.createElement('td');
            addDataToTable(cell, value);
            row.appendChild(cell);
        });
        tableBody.appendChild(row)
        createActionButtons(row);

        if (! JSON.parse(localStorage.getItem('myBooks'))) {
            // push to empty storage or reset system
            getBooks().push(this);
            localStorage.setItem('myBooks', JSON.stringify(myLibrary));
        } else {
            //push to existing storage. returns an array of book objects
            let books = getBooks();

            console.log(books);
            books.push(this);
        
            
         
            localStorage.setItem('myBooks', JSON.stringify(books));
            console.log(getBooks());

        }

    } else if (! JSON.parse(localStorage.getItem('myBooks'))) {
        myLibrary.push(this);
    }
}

function createCheckboxInput(cell, checkboxValue) {
    const input = document.createElement('input');
    cell.setAttribute('class', 'action')
    input.setAttribute('class', 'action isRead')
    input.name = "form__isRead";
    input.type = "checkbox"
    input.checked = checkboxValue;
    return input;
}

function addDataToTable(cell, value) {
    if (typeof value !== 'boolean') {
        cell.textContent = value;
    } else {
        const checkbox = createCheckboxInput(cell, value);
        cell.appendChild(checkbox);
    }
}

function getBooks() {
    //console.log(fromJson(myLibrary));
    return myLibrary;
}

function setBooks(books) {
    localStorage.setItem('myBooks', JSON.stringify(books));
}

function showBooks() {

    getBooks().forEach(book => {
        // Create table row
        const row = tableBody.appendChild(document.createElement('tr'));
        row.setAttribute('data-id', book.id);
        // iterate through values from current book object (array)
        Object.values(book).forEach(value => {
            // Create table cells
            let cell = document.createElement('td');
            addDataToTable(cell, value);
            row.appendChild(cell)
        });
        createActionButtons(row);
    });
}

function createActionButtons(row) {
    const deleteBook = document.createElement('td');
    const editBook = document.createElement('td');

    row.append(deleteBook, editBook);

    deleteBook.setAttribute('class', 'action delete');
    editBook.setAttribute('class', 'action edit');
}

function fromJson(objects) {
    return objects.map((value) => {
        return new Books(value.author,value.title, value.isRead);
    })
}

window.onload = function () {
    // Check local storage before creating default books
    if (localStorage.getItem('myBooks') == null) {
        const book1 = new Books("1984", "George Orwell", true).addToLibrary();
        const book2 = new Books("To Kill a Mockingbird", "Harper Lee").addToLibrary();
        const book3 = new Books("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", true).addToLibrary();
        const book4 = new Books("The Great Gatsby","F. Scott Fitzgerald").addToLibrary();
    }

    const rows = document.querySelector('table tbody');
    rows.addEventListener('click', function (e) {
        target = e.target;
        elementClass = target.classList.value;
        if (target !== "" && elementClass.includes('action')) {
            const tableRow = target.closest('tr');
            window.allBooks = getBooks();
            const allBooks = window.allBooks;

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
                    storeUpdateDialog.showModal();
                    break;
                case 'isRead':
                    // sets isRead property to true directly on the object
                    book.isRead = target.checked;
                    //localStorage.setItem('myBooks', JSON.stringify(allBooks));
                    setBooks(allBooks);
                    break
                default:
                    break;
            }
        }
    });
     showBooks();
};

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
            book = new Books(data.author_name, data.title_name, data.is_read);
            book.addToLibrary(true);
            break;
        case 'editBook':
            const books = window.allBooks;
            book = books[window.bookIndex];
            book.author = data.author_name;
            book.title = data.title_name;
            book.isRead = data.is_read;
            localStorage.setItem('myBooks', JSON.stringify(books))
            window.location.reload();
            break;
    }
    storeUpdateDialog.close();
})

const deleteButton = document.getElementById('deleteButton');

deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    // remove child element (selected row) from document
    const row = window.dialogData;
    row.remove();
    // remove book from myLibrary array
    const allBooks = window.allBooks;
    console.log(allBooks);
    allBooks.splice(window.bookIndex, 1);
    // add myLibrary to local storage
    localStorage.setItem('myBooks', JSON.stringify(allBooks));

    if (allBooks.length === 0) {
        if (window.confirm("reset the system?") && tableBody.querySelectorAll('tr').length == 0) {
            localStorage.clear();
            window.location.reload();
        }
    }

    document.getElementById('deleteDialog').close('');
});

function resetSystem(params) {
    
}