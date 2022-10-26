const Library = require('../models/library');
const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

async function generate() {
    const ratings = await Rating.findAll();
    if(ratings.length == 0) {
        const RATING_MODEL = {
            id: 1,
            username: "Test Max",
            stars: 50
        };
        await Rating.create(RATING_MODEL);
    }
    
    console.log('Create test data')
    const libraries = await Library.findAll();
    if(libraries.length == 0) {
        const LIBRARY_MODEL = {
            id: 1,
            library_uid: "83575e12-7ce0-48ee-9931-51919ff3c9ee",
            name: "Библиотека имени 7 Непьющих",
            city: "Москва",
            address: "2-я Бауманская ул., д.5, стр.1"
        };
        await Library.create(LIBRARY_MODEL);
    }
    const books = await Books.findAll();
    if(books.length == 0) {
        const BOOK_MODEL = {
            id: 1,
            book_uid: "f7cdc58f-2caf-4b15-9727-f89dcc629b27",
            name: "Краткий курс C++ в 7 томах",
            author: "Бьерн Страуструп",
            genre: "Научная фантастика",
            condition: "EXCELLENT",
        };
        await Books.create(BOOK_MODEL);
    }
    const library_books = await LibraryBooks.findAll();
    if(library_books.length == 0){
        const LB_MODEL = {
            library_id: 1,
            book_id: 1,
            available_count: 1,
        };
        await Books.create(LB_MODEL);
    }
}

module.exports = { generate };
