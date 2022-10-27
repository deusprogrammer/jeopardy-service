const express = require('express');
const Cards = require('../models/cardModel');

import {authenticatedUserHasRole, getAuthenticatedTwitchUserId} from '../utils/SecurityHelper';

let router = express.Router();

router.route("/")
    .get(async (request, response) => {
        try {
            let cards = await Cards.find({}, null).exec();
            return response.json(cards);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })
    .post(async (request, response) => {
        if (authenticatedUserHasRole(request, "ANONYMOUS_USER")) {
            response.status(403);
            return response.send("Insufficient privileges");
        }

        try {
            let card = await Cards.create(request.body);
            return response.json(card);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })

router.route("/:id")
    .delete(async (request, response) => {
        try {
            await Cards.findByIdAndDelete(request.params.id);
            return response.send();
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })

module.exports = router;