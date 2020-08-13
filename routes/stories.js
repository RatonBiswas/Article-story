//dashboard|auth|story

const express = require('express')
const {ensureAuth} = require('../middleware/auth');
const Story = require('../models/Story');
const router = express.Router()



// ! @desc Show add page
// ! @route Get/stories/add
router.get('/add', ensureAuth, (req,res)=> { 
    res.render('stories/add');
})


// ! @desc process the add form
// ! @route POST/stories
router.post('/', ensureAuth, async(req,res)=> { 
   try {       
    req.body.user = req.user.id;
    await Story.create(req.body);
    // console.log(stories);
    res.redirect('/dashboard')
   } catch (err) {
       console.error(err);
       res.render('error/500')
   }
})


// ! @desc Show stories page
// ! @route Get/stories
router.get('/', ensureAuth, async(req,res)=> { 
    try {
        const stories = await Story
            .find({status: 'public'})
            .populate('user')
            .sort({createdAt: -1})
            .lean()
        res.render('stories/index',{
            stories,
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
        
    }
})


module.exports = router