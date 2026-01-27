import User from "../../models/user.model.js";

export const getUserManagment = async (req, res) => {
  try {
    const search = req.query.search || '';

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.render('admin/users', {
      users,
      search,
       title: "Home | Stylo Fashion",
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
    await user.save();

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
