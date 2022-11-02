const router = require('express').Router();
const flash = require('connect-flash');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware.js')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds, success: res.locals.success });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findOne({ _id: req.params.id }).populate('reviews');
    if (!campground) {
        req.flash('error', "Cannot find campground");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', "Succesfully created campground");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/', catchAsync(async (req, res) => {
    const camp = new Campground({ title: "My backyard", description: "Cheap camping" })
    await camp.save()
    res.send(camp);
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', catchAsync(async (req, res) => {
    const filter = { _id: req.params.id };
    const update = req.body.campground
    let doc = await Campground.findOneAndUpdate(filter, update, { returnOriginal: false });
    req.flash('success', "Successfully updated campground");
    res.redirect(`/campgrounds/${doc._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds')
}));

module.exports = router;