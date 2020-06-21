const News = require("./models/news");
const Author = require("./models/author");
const fetch = require("node-fetch");


var getNews = function() {
    News.removeAll().then(() => {
        return fetch("http://newsapi.org/v2/top-headlines?country=us&apiKey=9ddca9922e3c4d3aaca0f2d83e113b96")
    }).then(value => value.text()).then(valueFromApi => {
        const newsUpdate = JSON.parse(valueFromApi);
        const getNewsFromOneAuthor = {};
        newsUpdate.articles.forEach(oneNew => {
            News.insert(new News(oneNew.author, oneNew.title, oneNew.description, oneNew.url, oneNew.urlToImage, oneNew.publishedAt, oneNew.content))
            if (oneNew.author) {
                if (getNewsFromOneAuthor[oneNew.author]) {
                    getNewsFromOneAuthor[oneNew.author].push(oneNew)
                } else {
                    getNewsFromOneAuthor[oneNew.author] = [oneNew]
                }
            } else {
                if (getNewsFromOneAuthor['newsWithoutAuthor']) {
                    getNewsFromOneAuthor['newsWithoutAuthor'].push(oneNew)
                } else {
                    getNewsFromOneAuthor['newsWithoutAuthor'] = [oneNew]
                }
            }
        })
        const arrayValueOneAuthor = Object.values(getNewsFromOneAuthor);
        const arrayKeyOneAuthor = Object.keys(getNewsFromOneAuthor);
        arrayValueOneAuthor.forEach((authorBlog, index) => {
            let authorBlogsLength = authorBlog.length;
            let sum = 0;
            authorBlog.forEach(blog => {
                if (!blog.content) {
                    sum = sum + 200;
                } else {
                    sum = sum + blog.description.length;
                }
            })
            console.log(`${arrayKeyOneAuthor[index]}, ${sum / authorBlogsLength}, ${authorBlogsLength}\n`)
            Author.removeAll().then(() => {
                const randomViewer = randomInteger(1000, 3000).toString();
                Author.insert(new Author(arrayKeyOneAuthor[index], sum / authorBlogsLength, authorBlogsLength, randomViewer))
            })
        })
    }).catch(e => console.log(e))
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getNews = getNews;