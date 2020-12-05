var express = require('express');
var router = express.Router();

// Require controller modules.
var maaltijd_controller = require('../controllers/maaltijdController');
var inschrijving_controller = require('../controllers/inschrijvingController');
var vrijwilliger_controller = require('../controllers/vrijwilligerController');

/// INSCHRIJVING ROUTES ///

router.get('/', inschrijving_controller.index); //This actually maps to /Home/ because we import the route with a /catalog prefix
//maps to /Home/contact page
router.get('/contact',inschrijving_controller.contact);
// GET request for creating Inschrijving. NOTE This must come before route for id (i.e. display author).
router.get('/inschrijving/create', inschrijving_controller.inschrijving_create_get);

// POST request for creating Inschrijving.
router.post('/inschrijving/create', inschrijving_controller.inschrijving_create_post);

// GET request to delete Inschrijving.
router.get('/inschrijving/:id/delete', inschrijving_controller.inschrijving_delete_get);

// POST request to delete Inschrijving.(volgens mij niet gebruikt, niet nodig)
router.post('/inschrijving/:id/delete', inschrijving_controller.inschrijving_delete_post);

// GET request for one Inschrijving.(volgens mij niet gebruikt, niet nodig)
router.get('/inschrijving/:id', inschrijving_controller.inschrijving_detail);

// GET request for list of all Inschrijving. NOG AANGEPAST .inschrijving_list
router.get('/inschrijvingen', inschrijving_controller.inschrijving_list);

/// MAALTIJD ROUTES ///

// GET catalog home page.

// GET request for creating a Maaltijd. NOTE This must come before routes that display Book (uses id).
router.get('/maaltijd/create', maaltijd_controller.maaltijd_create_get);

// POST request for creating Maaltijd.
router.post('/maaltijd/create', maaltijd_controller.maaltijd_create_post);

// GET request to delete Maaltijd.
router.get('/maaltijd/:id/delete', maaltijd_controller.maaltijd_delete_get);

// POST request to delete Maaltijd.
router.post('/maaltijd/:id/delete', maaltijd_controller.maaltijd_delete_post);

// GET request for one Maaltijd.
router.get('/maaltijd/:id', maaltijd_controller.maaltijd_detail);

// GET request for list of all Maaltijd items.
router.get('/maaltijden', maaltijd_controller.maaltijd_list);


/// VRIJWILLIGER ROUTES ///

// GET request for creating a Vrijwilliger.
router.get('/vrijwilliger/create', vrijwilliger_controller.vrijwilliger_create_get);

//POST request for creating Vrijwilliger.
router.post('/vrijwilliger/create', vrijwilliger_controller.vrijwilliger_create_post);

// GET request to delete Vrijwilliger. 
router.get('/vrijwilliger/:id/delete', vrijwilliger_controller.vrijwilliger_delete_get);

// POST request to delete Vrijwilliger.(volgens mij niet gebruikt, niet nodig)
router.post('/vrijwilliger/:id/delete', vrijwilliger_controller.vrijwilliger_delete_post);

// GET request for one Vrijwilliger. (volgens mij niet gebruikt, niet nodig)
router.get('/vrijwilliger/:id', vrijwilliger_controller.vrijwilliger_detail);

// GET request for list of all Vrijwilliger.
router.get('/vrijwilligers', vrijwilliger_controller.vrijwilliger_list);

module.exports = router;