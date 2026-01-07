

export const getAdminLogin=(req,res)=>{
    res.render('admin/login.ejs', {
    title: 'Home | Stylo Fashion',
    layout:'layouts/auth',
    error:"working"
  });
}

export const postAdminLogin= async (req,res)=>{

    try {
        const admin = await loginAdmin(req.body);
        req.session.admin = {
            id:admin._id,
            role:admin.role
        };
        res.redirect('/admin/dashboard')
        
    } catch (error) {
        res.render('admin/login',{
            error:error.message,
        title:"Admin login",
        layout:'layouts/auth',
        error:null
    })
        
    }
    
}

export const getDashboard = (req,res)=>{
    res.render('admin/dashboard',{
        error:"working dashboard"
    })
}