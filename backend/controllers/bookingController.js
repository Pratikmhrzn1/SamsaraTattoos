import Booking from "../models/Booking.js"
import log from "../utils/logger.js"
/**
 * Public
 * Submit booking request
 * Route:
 * POST/api/bookings
 */
export const createBooking = async (req,res,next)=>{
    try{
        const {firstName,lastName,email,phoneNumber,date,tattooIdea} = req.body;
        if(!firstName || !lastName || !email || !phoneNumber || !date || !tattooIdea){
            const error = new Error("Fill the required fields");
            error.statusCode=400;
            throw error;
        }
        const bookingData = {
            firstName,
            lastName,
            email,
            phoneNumber,
            date,
            tattooIdea
        };
        if(req.file){
            bookingData.referenceImage = `/uploads/bookings/${req.file.fileName}`;
        }
        const booking = await Booking.create(bookingData);
        log("success",`New booking request from ${email}`);
        res.status(201).json({
            success:true,
            message:"Booking request sent successfully!",booking
        });

    }catch(error){
        next(error);
    }
}
/*Only admin can access it
 * Get all bookings
 * Route: GET/api/bookings
 */
export const getAllBookings = async (req,res,next) => {
    try{
        const filter = {};
        if(req.query.status){
            filter.status = req.query.status;
        }
        const booking = await Booking.find(filter).sort({createdAt:-1})
        if(!booking){
            const error = new Error("Booking not found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success:true,
            count:booking.length,
            booking
        })
    }catch(error){
        next(error);
    }
}
/**Admin
 * Get single booking
 * Route: GET/api/bookings/:id
 */
export const getBookingById = async (req,res,next) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            const error = new Error("Booking not found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success:true,
            booking,
        })
    }catch(error){
        next(error);
    }
    
};
/**Only admin can access it
 * Update booking status and notes
 * Route: PATCH/api/bookings/:id/status
 */
export const updateBookingStatus = async (req,res,next) => {
    try{
        const {status,notes}= req.body;
        const allowedStatus = ['pending','accepted','rejected'];
        if(status &allowedStatus.includes(status)){
            const error = new Error(`Invalid status. Must be one of ${allowedStatus}.join(',')`);
            error.statusCode=400;
            throw error;
        }
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
               ...(status && {status}),...(notes!== undefined && {notes}) 
            },
            {new:true,runValidators:true}
        );
        if(!booking){
            const error =new Error("Booking not found");
            error.statusCode=404;
            throw error;
        }
        log("success",`Booking of ${req.params.id} updated to ${status}.`);
        res.status(200).json({
            success:true,
            booking
        })
    }catch(error){
        next(error);
    }
}
/**Can be accessed by admin and superadmin
 * Delete the booking 
 * Route: DELETE /api/bookings/:id
 */
export const deleteBooking = async (req,res,next) => {
    try{
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking){
            const error = new Error("Booking not found!");
            error.statusCode=404;
            throw error;
        }
        log("success",`Booking for ${req.params.id} has been deleted`);
        res.status(200).json({
            success:true,
            message:"Booking deleted"
        })
    }catch(error){
        next(error);
    }
}