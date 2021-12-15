const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// add a comment /api/comments/:pizzaId
router
.route('/:pizzaId')
.post(addComment);

// remove a comment /api/comments/:pizzaId/:commentId
router
.route('/:pizzaId/:commentId')
.delete(removeComment);

module.exports = router;