const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    return res.render('index.ejs', { error: req.query.error });
});


router.get('/chat', (req, res) => {
    if (!req.query.username || !req.query.room) {
        return res.redirect('/?error=incomplete');
    }

    return res.render('chat.ejs');
});

module.exports = router;