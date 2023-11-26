
const BannerImage = require("../models/bannerImage");

const router = require('express').Router()


router.get('/', async (req, res) => {
    const allImages= await BannerImage.find({});
    res.send(allImages);
})


module.exports = router