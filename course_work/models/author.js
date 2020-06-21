const mongoose = require('mongoose');

const AuthorShema = new mongoose.Schema({
    author: { type: String, required: false },
    byte: { type: String, required: false },
    viewed: { type: String, required: false },
    len: { type: String, required: true }
});

const AuthorModel = mongoose.model('author_stats', AuthorShema);

class Author {
    constructor(author, byte, len, viewed) {
        this.author = author;
        this.byte = byte;
        this.len = len;
        this.viewed = viewed;
    }

    static getById(id) {
        return AuthorModel.findById({ _id: id });
    }

    static getByName(name) {
        return AuthorModel.findOne({ name: name });
    }

    static getSomething(query) {
        return AuthorModel.find({}).select(query);
    }

    static getAll() {
        return AuthorModel.find();
    }

    static insert(author) {
        return new AuthorModel(author).save();
    }

    static findByDate(date) {
        return AuthorModel.find({ date: date });
    }

    static removeAll() {
        return AuthorModel.deleteMany({});
    }
}

module.exports = Author;