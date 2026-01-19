import User from "../../models/user.model.js";
import Address from "../../models/address.model.js";
import { addressSchema } from "../../validators/address.schema.js";

export const getUserProfile = async (req,res)=>{

    try {
        const userId = req.session.user?.id;
        
        const user = await User.findById(userId)
        .populate("referrals", "_id");

        if(!user){
            return res.redirect("/user/login")
        }
        
        res.render('users/profile/profile',{
        title:"profile | Stylo Fasion",
        user,
        totalReferrals: user.referrals?.length ||0
    });

        
    } catch (error) {
        console.log("error from profile",error);
        res.status(500).send("Server Error");
        
        
    }
    
}

export const getUserAddresses = async (req,res) =>{

    try {
        const userId = req.session.user?.id;

        const addresses = await Address.find({ userId });

        res.render('users/profile/address',{
        title: "Address | JStylo Fasion",
        addresses
    })


        
    } catch (error) {
        console.log(error);
    res.status(500).send("Server error");
        
    }
}

export const addUserAddress = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    const parsed = addressSchema.safeParse(req.body);

    if (!parsed.success) {
      console.log(parsed.error.flatten().fieldErrors);
      return res.redirect("/user/addresses");
    }
    console.log("thils is test before add",userId,parsed.data)

    await Address.create({
      userId,
      ...parsed.data,
      country:"India"
    });

    res.redirect("/user/addresses");

  } catch (error) {
    console.log(error);
    res.redirect("/user/addresses");
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    const addressId = req.params.id;

    const parsed = addressSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.redirect("/user/addresses");
    }

    await Address.updateOne(
      { _id: addressId, userId },
      { $set: parsed.data }
    );

    res.redirect("/user/addresses");

  } catch (error) {
    console.log(error);
    res.redirect("/user/addresses");
  }
};



