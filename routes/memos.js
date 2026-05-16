const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', memoController.listMemos);
router.get('/:id', memoController.getMemo);
router.post('/', memoController.createMemo);
router.put('/:id', memoController.updateMemo);
router.delete('/:id', memoController.deleteMemo);

module.exports = router;
