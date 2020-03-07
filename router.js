var express = require('express')
var User = require('./models/user')
var Topic = require('./models/topic')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login', function (req, res, next) {
  res.render('login.html')
})

router.post('/login', function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body

  User.findOne({
    eamil: body.eamil,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      // return res.status(500).json({
      //   err_code: 500,
      //   message: err.message
      // })
      return next(err)
    }

    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }

    // 用户存在，登陆成功，通过 Session 记录登录状态
    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK.'
    })
  })
})

router.get('/register', function (req, res, next) {
  res.render('register.html')
})

router.post('/register', function (req, res, next) {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  // 3. 发送响应
  var body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      // return res.status(500).json({
      //   err_code: 500,
      //   message: 'Internal error.'
      // })
      return next(err)
    }
    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
    }

    // 对密码进行 md5 重复加密
    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        // return res.status(500).json({
        //   err_code: 500,
        //   message: 'Internal error.'
        // })
        return next(err)
      }

      // 注册成功，使用 Seesion 记录用户的登录状态
      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
})

router.get('/settings/profile', function (req, res, next) {
  res.render('./settings/profile.html', {
    user: req.session.user
  })
})

router.post('/settings/profile', function (req, res, next) {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  // 3. 发送响应
  var body = req.body
  // console.log(body);
  User.findOne({
    email: body.eamil
  }, function (err, data) {
    if (err) {
      return next(err)
    }
    // console.log(data);
    new User(body).save(function (err, user) {
      if (err){
        return next(err)
      }

      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  })
})

router.get('/settings/admin', function (req, res, next) {
  res.render('./settings/admin.html', {
    user: req.session.user
  })
})

router.post('/settings/admin', function (req, res, next) {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  // 3. 发送响应

})

router.get('/topics/new', function (req, res,next) {
  res.render('./topic/new.html', {
    user: req.session.user
  })
})

router.post('/topics/new', function (req, res, next) {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  // 3. 发送响应
  new Topic(req.body).save(function (err, data) {
    if (err) {
      return next(err)
    }
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/topics/123', function (req, res, next) {
  res.render('./topic/show.html', {
    user: req.session.user
  })
})

router.get('/logout', function (req, res) {
  // 清除登录状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')
})

module.exports = router
