let books = [];
const endpointAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';

getSearchBook();

async function getSearchBook() {
    const res = await fetch(endpointAPI);
    books = await res.json();
    discountBooks = addDiscount(books);
    booksOnScreen(discountBooks);
}

// forEach para adicionar os livros registrados na API
const booksInsertElement = document.getElementById('livros');
const totalAvailableBooksElement = document.getElementById('valor_total_livros_disponiveis');

function booksOnScreen(booksList) {
    totalAvailableBooksElement.innerHTML = '';
    booksInsertElement.innerHTML = '';
    booksList.forEach(book => {
        let availability = book.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel';
        booksInsertElement.innerHTML += `
        <div class="livro">
            <img class="${availability}" src="${book.imagem}" alt="${book.alt}" />
            <h2 class="livro__titulo">
                ${book.titulo}
            </h2>
            <p class="livro__descricao">${book.autor}</p>
            <p class="livro__preco" id="preco">${book.preco.toFixed(2)}</p>
                <div class="tags">
                    <span class="tag">${book.categoria}</span>
                </div>
        </div>
        `
    });
}

// Map para aplicar descontos nos livros
function addDiscount(books) {
    const discount = 0.3;
    discountBooks = books.map(book => {
        return {...book, preco: book.preco - (book.preco * discount)}
    });
    return discountBooks;
}

// Filter para filtrar os livros por categoria
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => btn.addEventListener('click', filterBooks));

function filterBooks() {
    const elementBtn = document.getElementById(this.id);
    const category = elementBtn.value;
    let filteredBooks = category == 'disponivel' ? filterByAvaibility() : filterByCategory(category); 
    booksOnScreen(filteredBooks);
    if(category == 'disponivel') {
        const totalValueBooks = calculateTotalValueBooks(filteredBooks);
        totalAvailableBooksOnScreen(totalValueBooks);
    }
}

function filterByAvaibility() {
    return books.filter(book => book.quantidade > 0);
}

function filterByCategory(category) {
    return books.filter(livro => livro.categoria === category);
}

function totalAvailableBooksOnScreen(totalValueBooks) {
    totalAvailableBooksElement.innerHTML = `
    <div class="livros__disponiveis">
        <p>Todos os livros disponíveis por R$ <span id="valor">${totalValueBooks}</span></p>
    </div>
    `;
}

// Sort para ordenar os livros
let btnSortPrice = document.getElementById('btnOrdenarPorPreco');
btnSortPrice.addEventListener('click', sortPrice);

function sortPrice() {
    let orderedBooks = books.sort((a, b) => a.preco - b.preco);
    booksOnScreen(orderedBooks);
}

// Reduce para somar os preços dos livros
function calculateTotalValueBooks(books) {
    return books.reduce((acc, book) => acc + book.preco, 0).toFixed(2);
}
