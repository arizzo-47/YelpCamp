const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const getRng = (arr) => {
    return Math.floor((Math.random() * arr.length));
}

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rngCity = getRng(cities);
        const rngDesriptor = getRng(descriptors);
        const rngPlace = getRng(places);
        const price = Math.floor(Math.random() * 20) + 10;

        const newCampground = new Campground({
            location: `${cities[rngCity].city}, ${cities[rngCity].state}`,
            title: `${descriptors[rngDesriptor]} ${places[rngPlace]}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eius laboriosam temporibus similique sapiente eos nulla quod est praesentium optio perferendis porro nisi dolores vero, ducimus laudantium aliquid, minus sequi.",
            price: price

        })

        await newCampground.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
    console.log("DB Closed");
});