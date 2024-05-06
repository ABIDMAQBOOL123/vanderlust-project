const Listing = require("../models/listing");
module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings})
}

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs"); 
 }

 module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path: "author",
      },
    })
    .populate("Owner")
    if(!listing){
        req.flash("error", "listing you are requested for does not exist");
        res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
    newListing.image = {url, filename};
     await newListing.save();
     req.flash("success", "new listing created!")
     res.redirect("/listings")
 }

 module.exports.renderEditForm = async(req,res) =>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you are requested for does not exist");
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl})
}

module.exports.updateListing = async(req,res) =>{
    let {id}=req.params;
  
     let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !=="undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = { url, filename};
     await listing.save();
    }
     req.flash("success", "listing updated!")
     res.redirect(`/listings/${id}`);
 }

 module.exports.destroyListing = async(req,res) =>{
    let{id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!")
      res.redirect("/listings");


    }


    module.exports.searchListing = async (req, res) => {
      // Get the country name from the query parameters
      const countryName = req.query.country;
  
      // If country name is provided, find listings based on the country
      if (countryName) {
          const listings = await Listing.find({ country: countryName });
          res.redirect("listings", { listings });
      } else {
          // Otherwise, show all listings
          const listings = await Listing.find({});
          res.redirect("listings", { listings });
      }
  };






