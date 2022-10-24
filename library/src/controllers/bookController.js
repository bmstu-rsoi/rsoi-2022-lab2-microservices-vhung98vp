const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

class BookController {
    static getBookByUid = async(req, res, next) => {
        const book = await Books.findOne({
            where: {book_uid: req.params.bookUid}
        });
        if(book) {
            let resObj = {
                bookUid: book.book_uid,
                name: book.name,
                author: book.author,
                genre: book.genre,
                condition: book.condition,
            }
            return res.status(200).json(resObj);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    }

    static updateBookByUid = async(req, res, next) => {
        let book = await Books.findOne({where: {book_uid: req.params.bookUid}});
        if(req.body.condition){
            await Books.update({condition: req.body.condition}, { where: { book_uid: req.params.bookUid }});
        }

        let libraryBook = await LibraryBooks.findOne({
            where: {book_id: book.id}
        });
        let count = libraryBook.available_count;
        if(req.body.rent) {
            if(count == 0){
                return res.status(400).json();
            }
            count -= 1;
        } else {
            count += 1;
        }
        await LibraryBooks.update({available_count: count}, { where: { book_id: book.id} });
        return res.status(200).json();        
    }

    // static getAll = async(req, res, next) => {
    //     const books = await Books.findAll();
    //     return res.status(200).json(books);
    // }
    
    // static createOne = async(req, res, next) => {
    //     const MODEL = {
    //         book_uid: req.body.book_uid,
    //         name: req.body.name,
    //         author: req.body.author,
    //         genre: req.body.genre,
    //         condition: req.body.condition
    //       };
    //     try {
    //         const book = await Books.create(MODEL);
    //         res.setHeader('Location', `/api/v1/books/${book.id}`);
    //         return res.status(201).json();
    //     } catch (error) {
    //         return res.status(400).json({message: "Invalid data", errors: error});
    //     }
    // }

    // static getOne = async(req, res, next) => {
    //     const book = await Books.findByPk(req.params.id);
    //     if(book) {
    //         return res.status(200).json(book);
    //     } else {
    //         return res.status(404).json({message: "Book not found"});
    //     }
    // }

    // static updateOne = async(req, res, next) => {
    //     const book = await Books.findByPk(req.params.id);
    //     if(book) {      
    //         const MODEL = {
    //             book_uid: req.body.book_uid ?? book.book_uid,
    //             name: req.body.name ?? book.name,
    //             author: req.body.author ?? book.author,
    //             genre: req.body.genre ?? book.genre,
    //             condition: req.body.condition ?? book.condition,
    //         };      
    //         try {
    //             await Book.update(MODEL, { where: { id: req.params.id } });
    //             const updated = await Books.findByPk(req.params.id);
    //             return res.status(200).json(updated);
    //         } catch (error) {
    //             return res.status(400).json({message: "Invalid data", errors: error});
    //         }
    //     } else {
    //         return res.status(404).json({message: "Book not found"});
    //     }        
    // }

    // static deleteOne = async(req, res, next) => {
    //     await Books.destroy({ where: { id: req.params.id } });
    //     return res.status(204).json();
    // }
}

module.exports = BookController;