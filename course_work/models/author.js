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

    static getAll() {
        return AuthorModel.find();
    }

    static insert(author) {
        return new AuthorModel(author).save();
    }

    static removeAll() {
        return AuthorModel.deleteMany({});
    }
}

module.exports = Author;