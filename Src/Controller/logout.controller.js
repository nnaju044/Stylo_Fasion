export const logout = (req,res) =>{
    console.log("logout 4")
    req.session.destroy((err)=>{
        if(err){
            return res.redirect('/')
        }
    });

    res.clearCookie("connect.sid");

   if (req.originalUrl.startsWith("/admin")) {
      return res.redirect("/admin/login");
    }

    res.redirect("/login")
}