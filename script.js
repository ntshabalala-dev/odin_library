const myLibrary = JSON.parse(localStorage.getItem('myBooks')) ?? [];
const tableBody = document.querySelector('.books tbody');

function Books(title, author, isRead = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.isRead = isRead;
}

Books.prototype.addToLibrary = function (newBook = false) {
    // Add new book to local storage 
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

        
        // NOthing in local storage
        if (! JSON.parse(localStorage.getItem('myBooks'))) {
            // push to empty storage or reset system
            myLibrary.push(this);
            localStorage.setItem('myBooks', JSON.stringify(getBooks()));
        } else {
            //push to existing storage
            let books = JSON.parse(localStorage.getItem('myBooks'));
            books.push(this);
            localStorage.clear();
            localStorage.setItem('myBooks', JSON.stringify(books));
            console.log(localStorage.getItem('myBooks'));
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
    return myLibrary;
}


function showBooks() {
    console.log(myLibrary);
    
    getBooks().forEach(book => {
        // Create table row
        const row = tableBody.appendChild(document.createElement('tr'));
        row.setAttribute('data-id', book.id);
        // get values from current book object (array)
        let data = Object.values(book);
        //console.log(data);
        
        data.forEach(value => {
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

    //deleteBook.class = 'action delete';
    deleteBook.setAttribute('class', 'action delete');
    editBook.setAttribute('class', 'action edit');
}

function fromJson(objects) {
    return objects.map((value) => {
        return new Books(value.author,value.title, value.isRead);
    })
}


// let book1 = new Books('Dazai', 'no longer human');
// let book2 = new Books('Dazai', 'no longer human');


// book1.addBook();
// book2.addBook();
// console.log(book1.getBooks());

// const addButton = document.getElementById('addButton');
// addButton.addEventListener('click', () => {
//     let newBook = new Books('Dazai', 'no longer human');
//     newBook.addBook();
//     console.log(newBook.author);
// });

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
        // console.log(target);
        if (target !== "" && elementClass.includes('action')) {
            const tableRow = target.closest('tr');
            const rowId = tableRow.dataset.id;
            const allBooks = JSON.parse(localStorage.getItem('myBooks')) || getBooks();

            const bookIndex = allBooks.findIndex((book) => {
                return book.id == rowId
            })

            const book = allBooks[bookIndex];
            window.dialogData = tableRow;
            window.bookIndex = bookIndex;
            // console.log(tableRow);

            switch (elementClass.substr(7)) {
                case 'delete':
                    // e.preventDefault();
                    bookInformation.hidden = false;
                    bookTitle.textContent = book.title;
                    bookAuthor.textContent = book.author;
                    deleteDialog.showModal();
                    break;
                case 'edit':
                    addNewBookBtn.hidden = true;
                    editBtn.hidden = false;
                    storeUpdateDialog.showModal();
                    
                    break;
                case 'isRead':
                    // sets isRead property to true directly on the object
                   
                    localStorage.clear()
                    book.isRead = target.checked;
                    localStorage.setItem('myBooks', JSON.stringify(allBooks));

                    break
                default:
                    break;
            }
        }

    });

    showBooks();
};


const editBtn = document.getElementById('updateBook');
const addNewBookBtn = document.getElementById('addBook');
const storeUpdateDialog = document.getElementById('storeUpdateDialog');
const addBookToLibraryBtn = document.getElementById('addButton');
const cancel = document.getElementById('cancel');
const modalForm = document.querySelector('.modal__form');

addBookToLibraryBtn.addEventListener('click', function (e) {
    addNewBookBtn.hidden = false;
    editBtn.hidden = true;
    storeUpdateDialog.showModal();
});

modalForm.addEventListener('submit', function (e) {
    //console.log(e.submitter)
    e.preventDefault();
    
    if(e.submitter.value !== 'cancel' ) {
        formData = new FormData(this)
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        const isRead = data.is_read == 'on' ? true : false;
        const book = new Books(data.author_name, data.title_name, isRead);
        book.addToLibrary(true);
        console.log(book);
    }

    storeUpdateDialog.close();
})


const deleteDialog = document.getElementById('deleteDialog');
const deleteButton = document.getElementById('deleteButton');
const bookInformation = document.getElementById('bookInformation');
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');

deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    // remove child element (selected row) from document
    const row = window.dialogData;
    row.remove();
    // remove book from myLibrary array
    getBooks().splice(window.bookIndex, 1);
    // add myLibrary to local storage
    if (getBooks().length === 0) {
        alert('reset system?');
    }
    localStorage.setItem('myBooks', JSON.stringify(getBooks()));

    deleteDialog.close('');
});


deleteDialog.addEventListener("close", function () {

    // console.log('hello', this.returnValue);


    //   outputBox.value =
    //     deleteDialog.returnValue === "default"
    //       ? "No return value."
    //       : `ReturnValue: ${deleteDialog.returnValue}.`; // Have to check for "default" rather than empty string
});