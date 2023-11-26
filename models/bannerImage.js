const { model, Schema } = require("mongoose");

const BannerImageSchema = new Schema({

    'image':{
        type:String ,
        required: true
    }
   
})


const BannerImage= model("bannerImage",BannerImageSchema)

module.exports = BannerImage