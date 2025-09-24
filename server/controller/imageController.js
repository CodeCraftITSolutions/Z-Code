const Image = require('../models/image');
const User = require('../models/user');
const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res) => {
    const { image, userId } = req.body;

    try {
        if (!image || image === "") {
            return res.status(403).json({ message: "Please upload a file" });
        }
        if (!userId || userId === "") {
            return res.status(403).json({ message: "Please login to continue" });
        }

        const user = await Image.findOne({ userId });

        const result = await cloudinary.uploader.upload(image, {
            folder: "profiles",
            // width: 300,
            // crop: "scale"
        });

        if (!user) {
            const createdImage = await Image.create({
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                userId
            });
            return res.status(201).json(createdImage);
        } else {
            const updatedImage = await updateImage(result, userId, user._id);
            return res.status(201).json(updatedImage);
        }
    } catch (err) {
        // Handle any errors that occurred during the async operations
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getImage = async (req, res) => {
    const { userId } = req.params;
    if (!userId || userId === "") {
        return res.status(403).json({ message: "Please login to continue" });
    }
    try{
        const image = await Image.findOne({ userId});
    // if (!image) {
    //     const img = {
    //        image : {
    //             public_id:  "profiles/g4zlps28aeqc8br09k9a",
    //             url: "https://res.cloudinary.com/dljbly8ez/image/upload/v1719428575/profiles/g4zlps28aeqc8br09k9a.jpg"
    //        },
    //        userId
            
    //     }

    //     await Image.create(img);

    //     return res.status(404).json(img);
    // }
    return res.status(200).json(image);
}
    catch(err){
        return res.status(500).json({ message: "Internal Server Error" });
    
    }
}

const updateImage = async (result,userId,id) => {
    
    const updatedImage = await Image.findByIdAndUpdate(
        id,
        {
        image: {
                public_id: result.public_id,
                url: result.secure_url
            },
           userId
        },
        { new: true, runValidators: true }
      );
    
    return updatedImage;

}


const deleteImage = async (req, res) => {
    const { userId } = req.params;
    if (!userId || userId === "") {
        return res.status(403).json({ message: "Please login to continue" });
    }
    try {
        const image = await Image.findOneAndDelete({ userId });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        cloudinary. uploader.destroy(image.image.public_id);        
        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    uploadImage,
    getImage,
    deleteImage
}
