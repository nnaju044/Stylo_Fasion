// admin auth
export const adminAuth = (req,res,next) => {
    if(req.session.admin) {
        next();
    }else{
        res.redirect('/admin/login')
    }
}

export const adminGuest = (req,res,next) =>{
    if(req.session.admin){
        return res.redirect('/admin/dashboard')
    }
    next();
}

export const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};



