const router = require ("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

//add book to favorite
router.put("/add-book-to-favourite" , authenticateToken, async (req, res) =>{
    try {
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({messagw: "Book is Already in favourites"});
        }
        await User.findByIdAndUpdate(id, {$push:{favourites: bookid}});
        return res.status(200).json({messagw: "Book added to favourites"});

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        
    }
});

//remove from favourites
router.put("/remove-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;

        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isBookFavourite = userData.favourites.includes(bookid);

        if (!isBookFavourite) {
            return res.status(400).json({
                message: "Book is not in favourites"
            });
        }

        await User.findByIdAndUpdate(id, {
            $pull: { favourites: bookid }
        });

        return res.status(200).json({
            message: "Book removed from favourites"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

//get favourite books of a particular user
    router.get("/get-favourite-books", authenticateToken, async (req, res) =>{
        try {
            const {id} = req.headers;
            const userData = await User.findById(id).populate("favourites");
            const favouriteBooks = userData.favourites;
            return res.json({
                status: "Success",
                data: favouriteBooks,
            });
        } catch (error) {
            return res.status(500).json({
            message: "Internal server error"
                  })};
    });
module.exports = router;