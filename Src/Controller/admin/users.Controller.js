import User from "../../models/user.model.js";

export const getUserManagment = async (req, res) => {
  try {
    const search = req.query.search || '';

    let query = {};

    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.render('admin/users', {
      users,
      search,
      title: "Users | Stylo Fashion",
      layout: "layouts/auth",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to load users');
  }
};


export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;


    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    // Toggle the status
    user.isActive = !user.isActive;
    console.log("user from toggle1",user)
   try {
  await user.save();

  console.log("success", "User saved successfully");
} catch (error) {
  console.error("Error saving user:", error);

}


   res.json({
      success: true,
      message: user.isActive ? "User unblocked" : "User blocked",
      isActive: user.isActive
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle user status"
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let query = {};

    if (keyword) {
      query = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } }
        ]
      };
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit)
    });

  } catch (err) {
    res.status(500).json({ users: [], totalPages: 0 });
  }
};



