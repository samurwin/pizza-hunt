const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');

// add prefix to routes
router.use('/pizzas', pizzaRoutes);

module.exports = router;