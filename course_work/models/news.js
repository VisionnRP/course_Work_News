const mongoose = require('mongoose');

const NewsShema = new mongoose.Schema({
    author: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    url: { type: String, required: true },
    urlToImage: { type: String, required: true },
    publishedAt: { type: String, required: true },
    content: { type: String, required: false },
});

const NewsModel = mongoose.model('news_api', NewsShema);

class News {
    constructor(author, title, description, url, urlToImage, publishedAt, content) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.url = url;
        this.urlToImage = urlToImage;
        this.publishedAt = publishedAt;
        this.content = content;
    }

    static getById(id) {
        return NewsModel.findById({ _id: id });
    }

    static getByName(name) {
        return NewsModel.findOne({ name: name });
    }

    static getSomething(query) {
        return NewsModel.find({}).select(query);
    }

    static getAll() {
        return NewsModel.find();
    }

    static insert(news) {
        return new NewsModel(news).save();
    }

    static findByDate(date) {
        return NewsModel.find({ date: date });
    }

    static removeAll() {
        return NewsModel.deleteMany({});
    }
}

module.exports = News;