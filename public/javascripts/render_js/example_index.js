module.exports = {
  blank: {
    name: 'Stanley',
    birth: '1963/08/06',
    home: 'USA',
    job: 'enginner',
  },
}

// 在 app.js 裡面要引入時
let render_index = require('./public/javascripts/render_js/example')
app.get('/', (req, res) => {
  res.render('index', render_index.blank)
})
