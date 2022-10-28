const express = require('express');
const Categories = require('../models/categoryModel');
const Cards = require('../models/cardModel');

const router = express.Router();

const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const getMultipleRandom = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return shuffled.slice(0, num);
}

const createSession = async () => {
    let categories = await Categories.find({}, null).exec();
    let selectedCategories = getMultipleRandom(categories, 6);

    let categoryMaps = [];
    for (let category of selectedCategories.map(selectedCategory => selectedCategory.categoryString)) {
        let categoryMap = {name: category, cards: []};
        for (let difficulty = 1; difficulty <= 5; difficulty++) {
            let {data: cards} = await axios.get(`${cardUrl}?category=${category}&difficulty=${difficulty}`, {
                headers: {
                    "X-Access-Token": localStorage.getItem("accessToken")
                }
            });
            if (cards.length < 0) {
                throw new Error("No difficulty found");
            }
            categoryMap.cards.push(cards[0]);
        }
        categoryMaps.push(categoryMap);
    }
}

const sessionStore = {};

router.route("/")
    .post((req, res) => {
        
        sessionStore[uuidv4()] = {

        };
    })

router.route("/:id")
    .get((req, res) => {

    })