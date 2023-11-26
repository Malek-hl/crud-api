const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://hhmalek5:E7a1LJTyy7nxXQEW@clusterapi.y3esabj.mongodb.net/?retryWrites=true&w=majority"

)
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('Connection to database failed');
});

module.exports = mongoose;
// AbIOSAwgZWcJGYHO
// E7a1LJTyy7nxXQEW
