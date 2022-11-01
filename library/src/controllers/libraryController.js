const Library = require('../models/library');
const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

class LibraryController {
    static getLibrariesByCity = async(req, res, next) => {
        let page = req.query.page || 1;
        let limit = req.query.size || 1;
        let city = req.query.city;
        let offset = (page-1) * limit;
        try {
            const {count, rows} = await Library.findAndCountAll({
                where: {city},
                offset,
                limit
            });
            let items = rows.map(item => {
                return {
                    libraryUid: item.library_uid, 
                    name: item.name,
                    address: item.address,
                    city: item.city
                }
            })
            return res.status(200).json({
                page: Number(page), 
                pageSize: Number(limit), 
                totalElements: count, 
                items: items
            });
        } catch(error) {
            return res.status(500).json({message: error});
        }
        
    }

    static getBooksByLibrary = async(req, res, next) => {
        let page = req.query.page || 1;
        let limit = req.query.size || 1;
        let showAll = req.query.showAll || false;
        let libraryUid = req.params.libraryUid;
        let offset = (page-1) * limit;

        try {
            const library = await Library.findOne({
                where: {library_uid: libraryUid}
            });
            if(!library) {
                return res.status(404).json({message: "Library not found"});
            }
            let {count, rows} = await LibraryBooks.findAndCountAll({
                where: {library_id: library.id},
                offset,
                limit
            });
            if(!showAll){
                rows = rows.filter(item => {return item.available_count > 0});
            }
            let items = [];
            for(let row of rows){
                const book = await Books.findByPk(row.book_id);
                items.push({
                    bookUid: book.book_uid,
                    name: book.name,
                    author: book.author,
                    genre: book.genre,
                    condition: book.condition,
                    availableCount: row.available_count
                })
            }
            return res.status(200).json({
                page: Number(page), 
                pageSize: Number(limit), 
                totalElements: count, 
                items
            });
        } catch (error) {
            return res.status(500).json({message: error});
        }
        
    }

    static getLibraryByUid = async(req, res, next) => {
        const library = await Library.findOne({
            where: {library_uid: req.params.libraryUid}
        });
        if(library) {
            let resObj = {
                libraryUid: library.library_uid,
                name: library.name,
                address: library.address,
                city: library.city
            }
            return res.status(200).json(resObj);
        } else {
            return res.status(404).json({message: "Library not found"});
        }
    }
    
    // static createRelation = async(req, res, next) => {
    //     const MODEL = {
    //         library_id: req.body.library_id,
    //         book_id: req.body.book_id,
    //         available_count: req.body.available_count,
    //       };
    //     try {
    //         const relation = await LibraryBooks.create(MODEL);
    //         res.setHeader('Location', `/api/v1/library/${relation.id}`);
    //         return res.status(201).json();
    //     } catch (error) {
    //         return res.status(400).json({message: "Invalid data", errors: error});
    //     }
    // }
    
    // static getAll = async(req, res, next) => {
    //     const libraries = await Library.findAll();
    //     return res.status(200).json(libraries);
    // }

    // static createOne = async(req, res, next) => {
    //     const MODEL = {
    //         library_uid: req.body.library_uid,
    //         name: req.body.name,
    //         city: req.body.city,
    //         address: req.body.address
    //       };
    //     try {
    //         const library = await Library.create(MODEL);
    //         res.setHeader('Location', `/api/v1/library/${library.id}`);
    //         return res.status(201).json();
    //     } catch (error) {
    //         return res.status(400).json({message: "Invalid data", errors: error});
    //     }
    // }

    // static getOne = async(req, res, next) => {
    //     const library = await Library.findByPk(req.params.id);
    //     if(library) {
    //         return res.status(200).json(library);
    //     } else {
    //         return res.status(404).json({message: "Library not found"});
    //     }
    // }

    // static updateOne = async(req, res, next) => {
    //     const library = await Library.findByPk(req.params.id);
    //     if(library) {      
    //         const MODEL = {
    //             library_uid: req.body.library_uid ?? library.library_uid,
    //             name: req.body.name ?? library.name,
    //             city: req.body.city ?? library.city,
    //             address: req.body.address ?? library.address
    //         };      
    //         try {
    //             await Library.update(MODEL, { where: { id: req.params.id } });
    //             const updated = await Library.findByPk(req.params.id);
    //             return res.status(200).json(updated);
    //         } catch (error) {
    //             return res.status(400).json({message: "Invalid data", errors: error});
    //         }
    //     } else {
    //         return res.status(404).json({message: "Library not found"});
    //     }        
    // }

    // static deleteOne = async(req, res, next) => {
    //     await Library.destroy({ where: { id: req.params.id } });
    //     return res.status(204).json();
    // }
}

module.exports = LibraryController;