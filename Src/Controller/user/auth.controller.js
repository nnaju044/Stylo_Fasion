

export const getUserLogin = (req,res) =>{
    res.render('users/auth/login',{
        title:'Login | Stylo Fasion',
        layout:'layouts/auth'

    });
}

export const getUserSignup = (req,res) =>{
    res.render('users/auth/signup',{
        title: 'Signup | Stylo Fasion',
        layout: 'layouts/auth'
    })
}