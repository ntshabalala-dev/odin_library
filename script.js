const myLibrary = [];
const tableBody = document.querySelector('.books tbody');

function Books(author, title, isRead = false) {
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.isRead = isRead;
}


Books.prototype.addToLibrary = function (newBook = false) {
    myLibrary.push(this);
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
    }
}

function createCheckboxInput (cell, checkboxValue) {
    const input = document.createElement('input');
    cell.setAttribute('class', 'action')
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

Books.prototype.getBooks = function () {
    return myLibrary;
}

function showBooks() {
    myLibrary.forEach(book => {
        // Create table row
        const row = tableBody.appendChild(document.createElement('tr'));
        row.setAttribute('data-id', book.id);
        // get values from current book object (array)
        let data = Object.values(book);
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

    row.append(deleteBook,editBook);
    deleteBook.textContent = 'del';
    editBook.textContent = 'edit';

    //deleteBook.class = 'action delete';
    deleteBook.setAttribute('class', 'action delete');
    editBook.setAttribute('class', 'action edit');
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
    const book1 = new Books("George Orwell", "1984", true).addToLibrary();
    const book2 = new Books("Harper Lee", "To Kill a Mockingbird").addToLibrary();
    const book3 = new Books("J.K. Rowling", "Harry Potter and the Sorcerer's Stone", true).addToLibrary();
    const book4 = new Books("F. Scott Fitzgerald", "The Great Gatsby").addToLibrary();

    const rows = document.querySelector('table tbody');
    rows.addEventListener('click', function (e) {
        target = e.target;
        elementClass = target.classList.value;
        // console.log(target.classList.value);
        if (target !== "" && elementClass.includes('action')) {
            // isolate the second string
            console.log(target.closest('tr'));
            rowId = target.closest('tr');

            switch (elementClass.substr(7)) {
                case 'delete':

                    break;
                case 'edit':

                    break;

                default:
                    break;
            }
        }

    });

    showBooks();
};

const dialog = document.querySelector('dialog');
const addButton = document.getElementById('addButton');
const cancel = document.getElementById('cancel');
const modalForm = document.querySelector('.modal__form');

addButton.addEventListener('click', function (e) {
    dialog.showModal();
});

modalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formData = new FormData(this)
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const isRead = data.is_read == 'on' ? true : false;
    const book = new Books(data.author_name, data.title_name, isRead);
    book.addToLibrary(true);
    console.log(book);
    
    dialog.close();
})