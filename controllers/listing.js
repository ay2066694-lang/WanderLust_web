const Listing = require("../models/listing.js");

//index route
module.exports.indexRoute = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let allListing;
        
        if (search && search.trim() !== "") {
            const searchText = search.trim();
            allListing = await Listing.find({
                $or: [
                    {title: {$regex: searchText, $options: "i"}},
                    {location: { $regex: searchText,$options: "i"}},
                    { country: {$regex: searchText,$options: "i"}}]
            });
        } else {
            if (category) {
                allListing = await Listing.find({ category: category });
            } else {
                allListing = await Listing.find({});
            }
        }
        res.render("listing/index.ejs", {
            allListing,
            search: search || "",
            category: category || ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};


//Search Suggestions
module.exports.searchSuggestions = async (req, res, next) => {
    try {
        const { search } = req.query;

        if (!search || search.trim() === "") {
            return res.json([]);
        }
        const searchText = search.trim();
        const suggestions = await Listing.find({
            $or: [
                { title: { $regex: searchText, $options: "i" } },
                { location: { $regex: searchText, $options: "i" } },
                { country: { $regex: searchText, $options: "i" } }
            ]
        })
        .select("title location country")
        .limit(5);
        res.json(suggestions);

    } catch (err) {
        next(err);
    }
};


//New route
module.exports.newRoute = (req, res) => {
    res.render("listing/new.ejs")
};

//Show route
module.exports.showRoute = (async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "This Listing is dose not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
});


//Create route
module.exports.createRoute = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.geometry = {
    type: "Point",
    coordinates: [0, 0]
};
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    const location = req.body.listing.location;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "WanderLust/1.0"
            }});
    const data = await response.json();
    if (data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        newListing.geometry = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
    }else{
        return next(new ExpressError(400, "Location not found"));
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

};


//Edit route
module.exports.editRoute = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "This Listing is dose not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
};



//Update route
module.exports.updateRoute = async (req, res, next) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        {
            new: true,
            runValidators: true
        }
    );
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};



//Delete route
module.exports.deleteRoute = async (req, res, next) => {
    let { id } = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};