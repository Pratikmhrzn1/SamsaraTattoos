import Booking from '../models/Booking.js';
import galleryImage from '../models/GalleryImage.js';
import User from "../models/User.js";
import log from "../utils/logger.js";

/**
 * Get admin dashboard stats
 * Route GET /api/stats
 * Only admin can access it
 */
export const getStats = async (req,res,next) => {
    try{
        const [
            totalBookings,
            pendingBookings,
            confirmedBookings,
            rejectedBookings,
            totalGalleryImages,
            totalUsers,
            recentBookings

        ]=await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({status:"pending"}),
            Booking.countDocuments({status:"confirmed"}),
            Booking.countDocuments({status:"rejected"}),
            galleryImage.countDocuments(),
            User.countDocuments(),
            Booking.find().sort({createdAt:-1}).limit(7)//takes latest bookings

        ]);
        log("success","Stats fetched");
        res.status(200).json({
            success:true,
            stats:{
                bookings:{
                    total:totalBookings,
                    pending: pendingBookings,
                    confirmed:confirmedBookings,
                    rejected: rejectedBookings
                },
                users:{
                    total:totalUsers
                },
                recentBookings
            }
        });
    }catch(error){
        return next(error);
    }
}