var User = require('../models/user');


//get user details by id
exports.getUserDetails = (req, res) => {
    console.log(req);
    return User.findById(req)
        .then(user => {
            return (user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user."
            });
        });
};

//update user profile
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.fname || !req.body.lname || !req.body.address || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }


    var newUser = new User();
    var objForUpdate={};
    if (req.body.password != "****"){
         objForUpdate = {
            "local.email": req.body.email,
            "local.password": newUser.generateHash(req.body.password),
            "local.firstname": req.body.fname,
            "local.lastname": req.body.lname,
            "local.address": req.body.address
        }
    }
    else
    {
     objForUpdate = {
        "local.email": req.body.email,
        "local.firstname": req.body.fname,
        "local.lastname": req.body.lname,
        "local.address": req.body.address
        }
    }

    return User.findOneAndUpdate({_id: req.body.id}, objForUpdate
    , {new: true})
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.id
                });
            }
            return (user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "user not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "user updating with id " + req.params.id
            });
        });
};


//save login tracking info
exports.saveLoginTrack = (req, res) => {

    var date = new Date();
   return User.findOneAndUpdate({"local.email": req}, {
            $inc:{'attempt':1},
            Time:date.getTime()
        }, {new: true})
            .then(user => {
                return(user);
            }).catch(err => {
            if (err.kind === 'ObjectId') {
                return'404';
            }
            return '500'
        });
    };