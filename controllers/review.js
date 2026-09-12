const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Create Reviews route
module.exports.createReview = async (req, res)=>{
  let listing = await Listing.findById(req.params.id);
  let newRew = new Review(req.body.review);

    // console.log("PARAMS =", req.params);
    // console.log("ID =", req.params.id);
    // console.log("REQ BODY =", req.body);
    // console.log("REVIEW =", req.body.review);

     if (!listing) {
        return res.status(404).send("Listing not found");
    }

  newRew.author = req.user._id;
  // console.log(newRew);
  listing.reviews.push(newRew);

 await newRew.save();
 await listing.save();
 req.flash("success", "New Review Created!");
 res.redirect(`/listings/${listing._id}`);  
};


//Delete Review route
module.exports.deleteReview = async (req, res)=> {
     let {id, reviewId} = req. params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}