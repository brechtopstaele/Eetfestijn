var Vrijwilliger = require('../models/vrijwilliger');
var Maaltijd = require('../models/maaltijd');
var Inschrijving = require('../models/inschrijving');
const { body,validationResult } = require('express-validator');
var async = require('async');

//home page 
exports.index = function(req, res) {
    async.parallel({
        inschrijving_count: function(callback) {
            Inschrijving.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        maaltijd_count: function(callback) {
            Maaltijd.countDocuments({}, callback);
        },
        vrijwilliger_count: function(callback) {
            Vrijwilliger.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Eetfestijn', error: err,data:results });
    });
};

//contact page  
exports.contact=function(req,res){
    res.render('contact', { title: 'Contact page'});
};

// Display list of all Inschrijvingen. //WERKT
exports.inschrijving_list = function(req, res, next) {
    Inschrijving.find({}, 'family_name first_name maaltijd')
      .populate('maaltijd')
      .exec(function (err, list_inschrijvingen) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('inschrijving_list', { title: 'Inschrijvingslijst', inschrijving_list: list_inschrijvingen });
      });     
  };

// Display detail page for a specific inschrijving.
exports.inschrijving_detail = function(req, res, next) {
    async.parallel({
        inschrijving: function(callback) {
            Inschrijving.findById(req.params.id)
            .populate('maaltijd')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.inschrijving==null) { // No results.
            var err = new Error('Inschrijving not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('inschrijving_detail', { title: 'Inschrijving Detail', inschrijving: results.inschrijving } );
    });
};

// Display inschrijving create form on GET.
exports.inschrijving_create_get = function(req, res, next) { 
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({ 
        maaltijden: function(callback) {
            Maaltijd.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('inschrijving_form', { title: 'Inschrijvingsformulier', maaltijden: results.maaltijden });
    });    
};

// Handle inschrijving create on POST.
exports.inschrijving_create_post = [
    // Validate and sanitise fields.
    body('first_name', 'First name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('family_name', 'Family name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('maaltijd', 'Maaltijd must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var inschrijving = new Inschrijving(
          { first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            maaltijd: req.body.maaltijd,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({ 
                maaltijden: function(callback) {
                    Maaltijd.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('inschrijving_form', { title: 'Inschrijvingsformulier',maaltijden:results.maaltijden, inschrijving: inschrijving, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            inschrijving.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect('/Home/inschrijvingen');
                });
        }
    }
];

// Display inschrijving delete form on GET.
exports.inschrijving_delete_get = function(req, res,next) {
    async.parallel({
        inschrijving: function(callback){
            Inschrijving.findById(req.params.id).exec(callback)
        },
    },function(err,results){
        if(err){return next(err);} 
        res.render('inschrijving_delete',{title: 'Delete Inschrijving',inschrijving: results.inschrijving});
    });
};

// Handle inschrijving delete on POST.
exports.inschrijving_delete_post = function(req, res,next) {
    async.parallel({
        inschrijving: function(callback) {
          Inschrijving.findById(req.body.inschrijvingid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Inschrijving.findByIdAndRemove(req.body.inschrijvingid, function deleteInschrijving(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/Home/inschrijvingen')
            })
        }
    });
};
