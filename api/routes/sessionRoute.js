const express = require('express');
const { v4: uuidv4 } = require('uuid');

const Categories = require('../models/categoryModel');
const Cards = require('../models/cardModel');

const router = express.Router();

const sessionStore = {};

const SESSION_TTL = 1000 * 60 * 60 * 2;
const SESSION_CHECK_FREQ = 1000 * 60;

// Check for dead sessions
setInterval(() => {
    cleanupSessions(SESSION_TTL);
}, SESSION_CHECK_FREQ);

const cleanupSessions = (ttlms) => {
    for (sessionId in sessionStore) {
        let session = sessionStore[sessionId];
        let sessionAge = Date.now() - session.lastUpdated;
        if (sessionAge >= ttlms) {
            console.log(`Cleaning up session ${sessionId} because it is ${sessionAge}ms old`);
            delete sessionStore[sessionId];
        }
    }
}

const getMultipleRandom = (arr, num) => {
    if (num > arr.length) {
        throw new Error(`There are not enough elements to pull ${num} elements`);
    }

    const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
    return [shuffled.slice(0, num), shuffled.slice(num)];
}

const createSession = async (roundCount, players) => {
    let remainingCategories = await Categories.find({}, null).exec();

    let session = {
        lastUpdated: Date.now(),
        currentRound: 0,
        roundCount,
        maxPlayers,
        rounds: [],
        players
    };
    let categoryMaps = [];
    for (let i = 0; i < roundCount; i++) {
        let [selectedCategories, newRemainingCategories] = getMultipleRandom(remainingCategories, 6);
        remainingCategories = newRemainingCategories;
        for (let category of selectedCategories.map(selectedCategory => selectedCategory.categoryString)) {
            let categoryMap = {name: category, cards: []};
            for (let difficulty = 1; difficulty <= 5; difficulty++) {
                let cards = await Cards.find({category, difficulty}, null).exec();
                if (cards.length < 0) {
                    throw new Error("No difficulty found");
                }
                let [card] = getMultipleRandom(cards, 1);
                categoryMap.cards.push(card);
            }
            categoryMaps.push(categoryMap);
        }
        session.rounds.push({
            categories: categoryMaps
        });
    }

    return session;
}

router.route("/")
    .post(async (req, res) => {
        try {
            let {rounds, players} = req.body;
            let uuid = uuidv4();
            let session = await createSession(rounds, players);
            session.id = uuid;
            sessionStore[uuid] = session;

            return res.json(session);
        } catch (error) {
            console.error("Unable to create session ", error);
            res.status(500);
            return res.send();
        }
    });

router.route("/:id")
    .get((req, res) => {
        let session = sessionStore[req.params.id];

        if (!session) {
            res.status(404);
            return res.send();
        }

        session.lastUpdated = Date.now();
        sessionStore[req.params.id] = session;

        return res.json(session);
    })
    .put((req, res) => {
        let session = sessionStore[req.params.id];

        if (!session) {
            res.status(404);
            return res.send();
        }

        session.lastUpdated = Date.now();
        sessionStore[req.params.id] = session;

        return res.json(session);
    });

router.route("/:id/players")
    .post((req, res) => {
        let session = sessionStore[req.params.id];

        if (!session) {
            res.status(404);
            return res.send();
        }

        session.lastUpdated = Date.now();
        session.players[uuidv4()] = req.body;
        sessionStore[req.params.id] = session;

        return res.json(session);
    });

router.route("/:id/players/:playerId")
    .put((req, res) => {
        let session = sessionStore[req.params.id];

        if (!session && !session.players[req.params.playerId]) {
            res.status(404);
            return res.send();
        }

        session.lastUpdated = Date.now();
        session.players[req.params.playerId] = req.body;
        sessionStore[req.params.id] = session;

        return res.json(session);
    });

module.exports = router;