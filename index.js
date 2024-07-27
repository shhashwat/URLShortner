const express = require('express');

const ShortURL = require('./models/shortURL');
const shortURL = require('./models/shortURL');
const app = express();

const PORT = process.env.PORT || 8000;

const connectMongoDB = require("./db/connectMongo")

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get("/", async (req,res)=>{
    const ShortURLs = await ShortURL.find();
    return res.render('index',{ShortURLs: ShortURLs })
})

app.post('/shortURLs', async (req,res)=>{
    await ShortURL.create({ full: req.body.fullURL})

    res.redirect('/')
})

app.get('/:shortURL', async(req,res)=>{
    const shortURL = await ShortURL.findOne({ short: req.params.shortURL})
    if(shortURL === null) return res.sendStatus(404)
    
    shortURL.clicks ++
    shortURL.save()

    res.redirect(shortURL.full)
})

connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Failed to connect to MongoDB:", error);
});
