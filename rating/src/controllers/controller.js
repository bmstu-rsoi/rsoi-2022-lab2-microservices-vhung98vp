const Rating = require('../models/rating');

class RatingController {
    static getRatingByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        const rating = await Rating.findOne({where: {username}});
        if(rating){
            return res.status(200).json({stars: rating.stars});
        } else {
            return res.status(404).json({message: "Rating not found"});
        }        
    }

    static updateRatingByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let rating = await Rating.findOne({where: {username}});
        if(rating){
            await Rating.update({stars: req.body.stars}, {where: {username}});
            return res.status(200).json();
        } else {
            return res.status(404).json({message: "Rating not found"});
        }  
    }

    // static getAll = async(req, res, next) => {
    //     const ratings = await Rating.findAll();
    //     return res.status(200).json(ratings);
    // }
    
    // static createOne = async(req, res, next) => {
    //     const MODEL = {
    //         username: req.body.username,
    //         stars: req.body.stars
    //       };
    //     try {
    //         const rating = await Rating.create(MODEL);
    //         res.setHeader('Location', `/api/v1/rating/${rating.id}`);
    //         return res.status(201).json();
    //     } catch (error) {
    //         return res.status(400).json({message: "Invalid data", errors: error});
    //     }
    // }

    // static getOne = async(req, res, next) => {
    //     const rating = await Rating.findByPk(req.params.id);
    //     if(rating) {
    //         return res.status(200).json(rating);
    //     } else {
    //         return res.status(404).json({message: "Rating not found"});
    //     }
    // }

    // static updateOne = async(req, res, next) => {
    //     const rating = await Rating.findByPk(req.params.id);
    //     if(rating) {      
    //         const MODEL = {
    //             username: req.body.username ?? rating.username,
    //             stars: req.body.stars ?? rating.stars
    //         };      
    //         try {
    //             await Rating.update(MODEL, { where: { id: req.params.id } });
    //             const updated = await Rating.findByPk(req.params.id);
    //             return res.status(200).json(updated);
    //         } catch (error) {
    //             return res.status(400).json({message: "Invalid data", errors: error});
    //         }
    //     } else {
    //         return res.status(404).json({message: "Rating not found"});
    //     }        
    // }

    // static deleteOne = async(req, res, next) => {
    //     await Rating.destroy({ where: { id: req.params.id } });
    //     return res.status(204).json();
    // }
}

module.exports = RatingController;