// Do your work here...

document.addEventListener("DOMContentLoaded", function () {
    // Variable
    let isEdit = false
    let id = undefined
    // Input Element
    const inputBookTitleEl = document.getElementById("bookFormTitle")
    const inputBookAuthorEl = document.getElementById("bookFormAuthor")
    const inputBookYearEl = document.getElementById("bookFormYear")
    const inputBookIsCompleteEl = document.getElementById("bookFormIsComplete")
    const inputBookFormEl = document.getElementById("bookForm")
    const bookFormSubmitEl = document.getElementById("bookFormSubmit")
    const bookFormSubmitStateEl = document.getElementById("bookState")
    // Shelf Element
    const incompleteBookshelfEl = document.getElementById("incompleteBookList")
    const completeBookshelfEl = document.getElementById("completeBookList")
    // Search Element
    const searchBookEl = document.getElementById("searchBook")
    const searchBookTitleEl = document.getElementById("searchBookTitle")

    // Initial
    let books = []
    const storeBooks = localStorage.getItem("books")
    if (storeBooks) {
        books = JSON.parse(storeBooks)
    } else {
        localStorage.setItem("books", JSON.stringify([]))
    }
    renderBooks()

    // Submit New Book
    bookFormSubmitEl.addEventListener("click", function (event) {
        event.preventDefault()

        if (isEdit) {
            const index = books.findIndex((b) => b.id === id)
            if (index !== -1) {
                books[index].title = inputBookTitleEl.value
                books[index].author = inputBookAuthorEl.value
                books[index].year = Number(inputBookYearEl.value)
                books[index].isComplete = inputBookIsCompleteEl.checked
                isEdit = false
                id = undefined
                bookFormSubmitEl.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>"
            }
        } else {
            const isDuplicate = books.some(
            (book) =>
                book.title === inputBookTitleEl.value &&
                book.author === inputBookAuthorEl.value &&
                books[index].year === Number(inputBookYearEl.value)
            )
            if (isDuplicate) {
                alert("Buku dengan judul, penulis, dan tahun yang sama sudah ada.")
            } else {
                const newbook = {
                    id: new Date().getTime(),
                    title: inputBookTitleEl.value,
                    author: inputBookAuthorEl.value,
                    year: Number(inputBookYearEl.value),
                    isComplete: inputBookIsCompleteEl.checked,
                }
                books.push(newbook)
            }
        }
        saveBooksToLocalStorage()
        renderBooks()
        inputBookFormEl.reset()
    })

    // Search Book
    searchBookEl.addEventListener("submit", function (event) {
        event.preventDefault()
        const query = searchBookTitleEl.value.toLowerCase()
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(query)
        )
        renderBooks(filteredBooks)
    })

    // Change Book State
    inputBookIsCompleteEl.addEventListener("change", function () {
        if (this.checked) {
            bookFormSubmitStateEl.textContent = "selesai dibaca"
        } else {
            bookFormSubmitStateEl.textContent = "belum selesai dibaca"
        }
    })

    // Store Book to Local Storage
    function saveBooksToLocalStorage() {
        localStorage.setItem("books", JSON.stringify(books))
    }

    // Render Book
    function renderBooks(filteredBooks = books) {
        isEdit = false
        inputBookFormEl.reset()

        incompleteBookshelfEl.innerHTML = ""
        completeBookshelfEl.innerHTML = ""

        for (const book of filteredBooks) {
            const bookItem = document.createElement("div")
            bookItem.setAttribute("data-bookid", book.id)
            bookItem.setAttribute("data-testid", "bookItem")
            bookItem.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${
                    book.isComplete
                        ? "Belum Selesai Dibaca"
                        : "Selesai Dibaca"
                    }</button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                    <button data-testid="bookItemEditButton">Edit Buku</button>
                </div>
            `

            // Action
            const isCompleteButtonEl = bookItem.querySelector("[data-testid='bookItemIsCompleteButton']")
            const deleteButtonEl = bookItem.querySelector("[data-testid='bookItemDeleteButton']")
            const editButtonEl = bookItem.querySelector("[data-testid='bookItemEditButton']")

            isCompleteButtonEl.addEventListener("click", function () {
                const index = books.findIndex((b) => b.id === book.id)
                if (index !== -1) {
                    books[index].isComplete = !books[index].isComplete
                    saveBooksToLocalStorage()
                    renderBooks()
                }
            })

            deleteButtonEl.addEventListener("click", function () {
                const index = books.findIndex((b) => b.id === book.id)
                if (index !== -1) {
                    books.splice(index, 1)
                    saveBooksToLocalStorage()
                    renderBooks()
                }
            })

            editButtonEl.addEventListener("click", function () {
                const index = books.findIndex((b) => b.id === book.id)
                if (index !== -1) {
                    inputBookTitleEl.value = books[index].title
                    inputBookAuthorEl.value = books[index].author
                    inputBookYearEl.value = books[index].year
                    inputBookIsCompleteEl.checked = books[index].isComplete
                    id = books[index].id
                    isEdit = true
                    bookFormSubmitEl.textContent = "Perbaharui data buku"
                }
            })

            if (book.isComplete) {
                completeBookshelfEl.appendChild(bookItem)
            } else {
                incompleteBookshelfEl.appendChild(bookItem)
            }
        }
    }
})
