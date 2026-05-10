import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    problem: {
        type: String,
       required: true,
     },
     difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
     },
     host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
        },
        Participants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
         },
        status: {   
        type: String,
        enum: [ 'active', 'completed'],
        default: 'active',
        },
        // stream call id 
       CallId: {
        type: String,
        default: null,
         },

}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
    