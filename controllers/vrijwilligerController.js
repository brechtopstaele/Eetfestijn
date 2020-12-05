var Vrijwilliger = require('../models/vrijwilliger');
const { body,validationResult } = require('express-validator');
var async = require('async');



// Display list of all Vrijwilligers. 
exports.vrijwilliger_list = function(req, res, next) {
    Vrijwilliger.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_vrijwilliger) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('vrijwilliger_list', { title: 'Vrijwilligerslijst', vrijwilliger_list: list_vrijwilliger });
      });
  };

// Display detail page for a specific Vrijwilliger.
exports.vrijwilliger_detail = function(req, res, next) {
  async.parallel({
      vrijwilliger: function(callback) {
          Vrijwilliger.findById(req.params.id)
            .exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); } // Error in API usage.
      if (results.vrijwilliger==null) { // No results.
          var err = new Error('Vrijwilliger not found');
          err.status = 404;
          return next(err);
      }
      // Successful, so render.
      res.render('vrijwilliger_detail', { title: 'Vrijwilliger Detail', vrijwilliger: results.vrijwilliger } );
  });
};


// Display Vrijwilliger create form on GET.
exports.vrijwilliger_create_get = function(req, res, next) { 
  //  res.render('NOT IMPLEMENTED: vrijwilliger_create_get')
    res.render('vrijwilliger_form', { title: 'Vrijwilligerformulier' });
};

// Handle Vrijwilliger create on POST.
exports.vrijwilliger_create_post = [
    // Validate and sanitise fields.
    body('first_name', 'First name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('family_name', 'Family name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    // Process request after validation and sanitization.
    (req, res, next) => {     
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var vrijwilliger = new Vrijwilliger(
          { first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
           });
        if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('vrijwilliger_form', { title: 'Vrijwilligerformulier', vrijwilliger: vrijwilliger, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Save book.
            vrijwilliger.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect('/Home/vrijwilligers');
                });
        }
    }
];

// Display Vrijwilliger delete form on GET.
exports.vrijwilliger_delete_get = function(req, res,next) {
 // res.render('NOT IMPLEMENTED: vrijwilliger_delete_get')
    async.parallel({
        vrijwilliger: function(callback){
            Vrijwilliger.findById(req.params.id).exec(callback)
        },
    },function(err,results){
        if(err){return next(err);} 
        res.render('vrijwilliger_delete',{title: 'Delete Vrijwilliger',vrijwilliger: results.vrijwilliger});
    });
};

// Handle Vrijwilliger delete on POST.
exports.vrijwilliger_delete_post = function(req, res,next) {
  //res.render('NOT IMPLEMENTED: vrijwilliger_delete_post')
    async.parallel({
        vrijwilliger: function(callback) {
          Vrijwilliger.findById(req.body.vrijwilligerid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Vrijwilliger.findByIdAndRemove(req.body.vrijwilligerid, function deleteVrijwilliger(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/Home/vrijwilligers')
            })
        }
    });
};

