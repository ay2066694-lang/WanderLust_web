const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const { indexRoute, newRoute, showRoute, createRoute, editRoute, updateRoute, deleteRoute } = require("../controllers/listing.js");

router.route("/")
.get(indexRoute)
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createRoute));


//New route
router.get("/new", isLoggedIn, newRoute);


router.route("/:id")
.get(wrapAsync(showRoute))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(updateRoute))
.delete(isLoggedIn, isOwner, wrapAsync(deleteRoute));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));



module.exports = router;