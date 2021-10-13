const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

const myKEY = "6d501c3820d27f19b88f8d9aef77c4bc";

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/movie/popular/1')
})

app.get('/movie/popular/:page', (req, res) => {
    console.log(req.params)
    axios.all([
        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${myKEY}&language=en-US&page=${req.params.page}`),
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=6d501c3820d27f19b88f8d9aef77c4bc&language=en-US')
    ])
        .then(axios.spread((res1, res2) => {
            // Both requests are now complete
            res.render('pages/index.ejs', {
                data: res1.data.results,
                dataGenres: res2.data.genres,
                pages: req.params.page
            })
        }))
        .catch(function (error) {
            // handle error
            console.log(error)
        })
})

app.get('/movie/search/', (req, res) => {
    console.log(req.params)
    console.log(req.query)

    axios.all([
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${myKEY}&query=${req.query.search}`),
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=6d501c3820d27f19b88f8d9aef77c4bc&language=en-US')
    ])
        .then(axios.spread((res1, res2) => {
            // Both requests are now complete

            res.render('pages/search.ejs', {
                data: res1.data.results,
                dataGenres: res2.data.genres,
                pages: req.params.page
            })
        }))
        .catch(function (error) {
            // handle error
            console.log(error)
        })
})

app.get('/movie/popular/genres/:page/:idGenre', (req, res) => {
    console.log(req.params)
    axios.all([
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${myKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${req.params.page}&with_genres=${req.params.idGenre}`),
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${myKEY}&language=en-US`)
    ])
        .then(axios.spread((res1, res2) => {
            // Both requests are now complete

            res.render('pages/genres.ejs', {
                data: res1.data.results,
                dataGenres: res2.data.genres,
                idGenre: req.params.idGenre,
                pages: req.params.page
            })
        }))
        .catch(function (error) {
            // handle error
            console.log(error)
        })
})

app.get('/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=6d501c3820d27f19b88f8d9aef77c4bc&language=en-US`)
        .then(function (response) {
            // handle success
            res.render('pages/movie.ejs', { dataMovie: response.data })
        })
        .catch(function (error) {
            // handle error
            console.log(error)
        })
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})