const express = require('express');
const Categories = require('../models/categoryModel');

import {authenticatedUserHasRole} from '../utils/SecurityHelper';

let router = express.Router();

router.route("/")
    .get(async (request, response) => {
        try {
            let categories = await Categories.find({}, null).exec();
            return response.json(categories);
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
            let category = await Categories.create(request.body);
            return response.json(category);
        } catch (error) {
            console.error(error);
            response.status(500);
            return response.send(error);
        }
    })

module.exports = router;