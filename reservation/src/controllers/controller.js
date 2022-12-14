const axios = require('axios');
const Reservation = require('../models/reservation');
const PORT = process.env.PORT || 8080;
const GATEWAY_URL = (process.env.GATEWAY_URL || 'http://localhost') + ':' + PORT

class ReservationController {
    static getReservationsByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        const reservations = await Reservation.findAll({where: {username}});
        let items = [];
        for (const item of reservations){
            let libResp = await axios.get(GATEWAY_URL + '/api/v1/libraries/' + item.library_uid);
            let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + item.book_uid);
            items.push({
                reservationUid: item.reservation_uid,
                status: item.status,
                startDate: item.start_date.toISOString().slice(0, 10),
                tillDate: item.till_date.toISOString().slice(0, 10),
                book: bookResp.data,
                library: libResp.data
            });
        }
        return res.status(200).json(items);
    }

    static takeBook = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let {bookUid, libraryUid, tillDate} = req.body;
        try{
            let rentedTotal = await Reservation.count({where: {username, status: 'RENTED'}});
            let ratingResp = await axios.get(GATEWAY_URL + '/api/v1/rating', {headers: {'x-user-name': username}})
            let stars = ratingResp.data.stars;
            if (stars > rentedTotal){
                try {
                    await axios.patch(GATEWAY_URL + '/api/v1/books/' + bookUid, {rent: true});
                    const MODEL = {
                        username: username,
                        book_uid: bookUid,
                        library_uid: libraryUid,
                        status: 'RENTED',
                        start_date: new Date(),
                        till_date: tillDate
                    };
                    const reservation = await Reservation.create(MODEL);
                    let libResp = await axios.get(GATEWAY_URL + '/api/v1/libraries/' + libraryUid);
                    let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + bookUid);
                    let resObj = {
                        reservationUid: reservation.reservation_uid,
                        status: reservation.status,
                        startDate: reservation.start_date.toISOString().slice(0, 10),
                        tillDate: reservation.till_date.toISOString().slice(0, 10),
                        book: bookResp.data,
                        library: libResp.data
                    }
                    return res.status(200).json(resObj);
                } catch (error) {
                    return res.status(400).json({ message: 'Data validation error'})
                }
            } else {
                return res.status(400).json({ message: 'Data validation error'})
            }
        } catch (e) {
            return res.status(400).json({message: e})
        }
        
        
    }

    static returnBook = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let reservation_uid = req.params.reservationUid;
        let {condition, date} = req.body;
        let reservation = await Reservation.findOne({where: {username, reservation_uid}});
        if(reservation){
            let ratingResp = await axios.get(GATEWAY_URL + '/api/v1/rating', {headers: {'x-user-name': username}})
            let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + reservation.book_uid);
            let stars = ratingResp.data.stars;
            if(date > reservation.till_date){
                reservation.status = 'EXPIRED';
                stars -= 10;
                if(condition != bookResp.data.condition){
                    stars -= 10;
                }
            } else {
                reservation.status = 'RETURNED';
                if(condition != bookResp.data.condition){
                    stars -= 10;
                } else {
                    stars += 1;
                }
            }
            await axios.patch(GATEWAY_URL + '/api/v1/books/' + reservation.book_uid, {rent: false, condition});
            await axios.patch(GATEWAY_URL + '/api/v1/rating', {stars}, {headers: {'x-user-name': username}});
            return res.status(204).json();            
        } else {
            return res.status(404).json({message: "Reservation not found"});
        }
        
    }

    // static getAll = async(req, res, next) => {
    //     const reservations = await Reservation.findAll();
    //     return res.status(200).json(reservations);
    // }
    
    // static createOne = async(req, res, next) => {
    //     const MODEL = {
    //         reservation_uid: req.body.reservation_uid,
    //         username: req.body.username,
    //         book_uid: req.body.book_uid,
    //         library_uid: req.body.library_uid,
    //         status: req.body.status,
    //         start_date: req.body.start_date,
    //         till_date: req.body.till_date
    //       };
    //     try {
    //         const reservation = await Reservation.create(MODEL);
    //         res.setHeader('Location', `/api/v1/reservation/${reservation.id}`);
    //         return res.status(201).json();
    //     } catch (error) {
    //         return res.status(400).json({message: "Invalid data", errors: error});
    //     }
    // }

    // static getOne = async(req, res, next) => {
    //     const reservation = await Reservation.findByPk(req.params.id);
    //     if(reservation) {
    //         return res.status(200).json(reservation);
    //     } else {
    //         return res.status(404).json({message: "Reservation not found"});
    //     }
    // }

    // static updateOne = async(req, res, next) => {
    //     const reservation = await Reservation.findByPk(req.params.id);
    //     if(reservation) {      
    //         const MODEL = {
    //             reservation_uid: req.body.reservation_uid ?? reservation.reservation_uid,
    //             username: req.body.username ?? reservation.username,
    //             book_uid: req.body.book_uid ?? reservation.book_uid,
    //             library_uid: req.body.library_uid ?? reservation.library_uid,
    //             status: req.body.status ?? reservation.status,
    //             start_date: req.body.start_date ?? reservation.start_date,
    //             till_date: req.body.till_date ?? reservation.till_date
    //         };      
    //         try {
    //             await Reservation.update(MODEL, { where: { id: req.params.id } });
    //             const updated = await Reservation.findByPk(req.params.id);
    //             return res.status(200).json(updated);
    //         } catch (error) {
    //             return res.status(400).json({message: "Invalid data", errors: error});
    //         }
    //     } else {
    //         return res.status(404).json({message: "Reservation not found"});
    //     }        
    // }

    // static deleteOne = async(req, res, next) => {
    //     await Reservation.destroy({ where: { id: req.params.id } });
    //     return res.status(204).json();
    // }
}

module.exports = ReservationController;