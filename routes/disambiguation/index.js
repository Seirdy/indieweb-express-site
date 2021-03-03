const debug = require('debug')('indieweb-express-site:routes:disambiguation')
const asyncHandler = require('express-async-handler')
const renderNav = require('../../middleware/render-nav')
const checkAuthentication = require('../../middleware/check-authentication')
const multer = require('multer')
const upload = multer()

const md = require('../../utilities/markdown-it')

// 🏃‍♀️💨 Express
const express = require('express')
const router = express.Router()
const models = require('../../models')

// 🔓 Public routes 
router.get(`/disambiguation`, [checkAuthentication], asyncHandler(async (req, res, next) => {
  try {

    let form_state = {}

    form_state['title'] = req.query ? req.query.title : ''
    form_state['text'] = req.query ? req.query.text : ''
    form_state['url'] = req.query ? req.query.url : ''

    res.render(req.query.title || req.query.text || req.query.url ? 'content-create/disambiguation-post' : 'content-create/disambiguation-get', {
      data: { title: 'Disambiguation' },
      contentHtml: md.render('Just used for manual testing.'),
      state: form_state
    })
  } catch (error) {
    debug(error)
  }
}))

router.post(`/disambiguation`, [upload.none(), checkAuthentication], asyncHandler(async (req, res, next) => {
  try {
    let form_state = {}

    form_state['title'] = req.query && req.query.title ? req.query.title : req.body.title || ''
    form_state['text'] = req.query && req.query.text ? req.query.text : req.body.text || ''
    form_state['url'] = req.query && req.query.url ? req.query.url : req.body.url || ''
    
    res.render('content-create/disambiguation-post', {
      data: { title: 'Disambiguation' },
      state: form_state
    })
  } catch (error) {
    console.log('error!: ', error)
    debug(error)
  }
}))

module.exports = router
