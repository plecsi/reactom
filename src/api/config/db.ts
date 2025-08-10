import mongoose from 'mongoose';
//mongoose.connect('mongodb://127.0.0.1:27017/plecsi')
mongoose.connect('mongodb+srv://plecsi:6342nXpl@settings.ilkoar9.mongodb.net/test')

mongoose.connection.once('open', ()=>{
    console.log('MongoDB Connected Successfully');
})
//module.exports = mongoose;

export default mongoose;