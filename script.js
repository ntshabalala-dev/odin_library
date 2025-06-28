const myLibrary = [];

function Books(author, title, isRead = false) {
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.isRead = isRead;
}


Books.prototype.addBook = function () {
    myLibrary.push(this);
    console.log('new book added');
    
}

Books.prototype.getBooks = function() {
    return myLibrary;
}

function showBooks()  {
    const tableBody = document.querySelector('.books tbody');
    myLibrary.forEach(book => {
        // Create table row
        const row = tableBody.appendChild(document.createElement('tr'));
        // get values from current book object (array)
        let data = Object.values(book);
        data.forEach(value => {
            // Create table cells
            let cell = row.appendChild(document.createElement('td'));
            // attach book data to cells
            cell.textContent = value;
        });

        createActionButtons(row);
    });
}

function createActionButtons(row) {
    const deleteBook = row.appendChild(document.createElement('td'));
    deleteBook.textContent = 'del';
    const editBook = row.appendChild(document.createElement('td'));
    editBook.textContent = 'edit';
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

window.onload = function() {
    const book1 = new Books("George Orwell", "1984", true).addBook();
    const book2 = new Books("Harper Lee", "To Kill a Mockingbird").addBook();
    const book3 = new Books("J.K. Rowling", "Harry Potter and the Sorcerer's Stone", true).addBook();
    const book4 = new Books("F. Scott Fitzgerald", "The Great Gatsby").addBook();
    showBooks();
};


const dialog = document.querySelector('dialog');
const addButton = document.getElementById('addButton');
const cancel = document.getElementById('cancel');
const addBook = document.getElementById('addBook');


addButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('hello');
    dialog.showModal();
});

cancel.addEventListener('click', function(e) {
    // e.preventDefault();
    
    // dialog.close();
    console.log(dialog.returnValue);
    
})

addBook.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('book added');
    
})