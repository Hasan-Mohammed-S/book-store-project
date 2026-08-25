const Writer = require('../models/writer');
const Book = require('../models/book');


const newWriter = (req, res) => {
  res.render('writers/new.ejs', { title:'Add a new Writer' });
};


const createWriter = async (req, res) => {
  try {
    const writerData = {
      name: req.body.name,
      bio: req.body.bio,

      image: req.file ? req.file.path : 'https://placeholder.com'
    };
    
    await Writer.create(writerData);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/writers/new');
  }
};

const showWriter = async (req, res) => {
  try {
    const writer = await Writer.findById(req.params.id).populate('books');
    if (!writer) return res.redirect('/');
    
    res.render('writers/show.ejs', { 
      title: writer.name, 
      writer: writer 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

module.exports = {
  newWriter,
  createWriter,
  showWriter
};
