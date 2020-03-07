var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

var Schema = mongoose.Schema

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('success mongoose');
})

var userSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Topic', userSchema)