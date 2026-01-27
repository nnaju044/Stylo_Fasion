import express from 'express';

const router = express.Router();

router.get('/',(req, res) => {
  res.render('users/home.ejs', {
    title: 'Home | Stylo Fashion'
  });
});
export default router

