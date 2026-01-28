export const logout = (req,res) =>{

   if (req.originalUrl.startsWith("/admin")) {
    req.session.admin = null;
      return res.redirect("/admin/login");
    }else{
       req.session.user = null;
       res.redirect("/"); 
    }
}