var async = require('async');
var Maaltijd = require('../models/maaltijd');
var Inschrijving = require('../models/inschrijving');
const { body,validationResult } = require('express-validator');//nog aanpassen misschien

// Display list of all Maaltijden.
exports.maaltijd_list = function(req, res, next) {
    Maaltijd.find()
      .sort([['naam', 'ascending']])
      .exec(function (err, list_maaltijden) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('maaltijd_list', { title: 'Maaltijden die we momenteel aanbieden', maaltijd_list: list_maaltijden });
      });
  
  };

// Display detail page for a specific Maaltijd.
exports.maaltijd_detail = function(req, res, next) {
    async.parallel({
        maaltijd: function(callback) {
            Maaltijd.findById(req.params.id)
              .exec(callback)
        },
        maaltijden_inschrijvingen: function(callback) {
            Inschrijving.find({ 'maaltijd': req.params.id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.maaltijd==null) { // No results.
            var err = new Error('Maaltijd not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('maaltijd_detail', { title: 'Maaltijd Detail', maaltijd: results.maaltijd, maaltijd_inschrijvingen: results.maaltijden_inschrijvingen } );
    });
};

// Display Maaltijd create form on GET.
exports.maaltijd_create_get = function(req, res, next) {      
    res.render('maaltijd_form', { title: 'Voeg maaltijd toe!'});
};

// Handle Maaltijd create on POST.
exports.maaltijd_create_post = [

    // Validate and sanitise fields.
    body('naam').trim().isLength({ min: 1 }).escape().withMessage('Naam moet ingegeven worden.')
        .isAlphanumeric().withMessage('Naam has non-alphanumeric characters.'),
    body('hoofd_ingredient').trim().isLength({ min: 1 }).escape().withMessage('Hoofdingrediënt moet ingegeven worden.')
        .isAlphanumeric().withMessage('Hoofd ingrediënt has non-alphanumeric characters.'),
    body('prijs').trim().isLength({ min: 1}).escape().withMessage('Prijs moet ingegeven worden.'),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('maaltijd_form', { title: 'Voeg maaltijd toe!', maaltijd: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Maaltijd object with escaped and trimmed data.
            var maaltijd = new Maaltijd(
                {
                    naam: req.body.naam,
                    hoofd_ingredient: req.body.hoofd_ingredient,
                    prijs: req.body.prijs,
                    summary: req.body.summary
                });
            maaltijd.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new maaltijd record.
                res.redirect(maaltijd.url);
            });
        }
    }
];

// Display Maaltijd delete form on GET.
exports.maaltijd_delete_get = function(req, res, next) {
    async.parallel({
        maaltijd: function(callback) {
            Maaltijd.findById(req.params.id).exec(callback)
        },
        maaltijden_inschrijvingen: function(callback) {
          Inschrijving.find({ 'maaltijd': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.maaltijd==null) { // No results.
            res.redirect('/Home/maaltijden');
        }
        // Successful, so render.
        res.render('maaltijd_delete', { title: 'Delete Maaltijd', maaltijd: results.maaltijd, maaltijd_inschrijvingen: results.maaltijden_inschrijvingen } );
    });

};

// Handle Maaltijd delete on POST.
exports.maaltijd_delete_post = function(req, res, next) {
    async.parallel({
        maaltijd: function(callback) {
          Maaltijd.findById(req.body.maaltijdid).exec(callback)
        },
        maaltijden_inschrijvingen: function(callback) {
          Inschrijving.find({ 'maaltijd': req.body.maaltijdid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.maaltijden_inschrijvingen.length > 0) {
            // maaltijd is al besteld geweest. Render in same way as for GET route.
            res.render('maaltijd_delete', { title: 'Delete Maaltijd', maaltijd: results.maaltijd, maaltijd_inschrijvingen: results.maaltijden_inschrijvingen } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Maaltijd.findByIdAndRemove(req.body.maaltijdid, function deleteMaaltijd(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/Home/maaltijden')
            })
        }
    });
};

