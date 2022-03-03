const mongoose = require('mongoose');

//mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://127.0.0.1:27017/login', {
  useNewUrlParser: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));
