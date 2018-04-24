const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, closeServer, runServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    it('should list all blog posts on GET', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                })
            });
    });

    it('should add a new item on POST', function(){
        const newPost = {
            title: 'Best Post Ever',
            content: 'This is the best post ever',
            author: 'Me',
        };
        return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id','title','content','author','publishDate');
            expect(res.body.id).to.not.equal(null);
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.author).to.equal(newPost.author)
        });
    });

    it('should delete a post on DELETE',function(){
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            return chai.request(app)
                .delete(`/blog-posts/${res.body[0].id}`)
        })
        .then(function(res){
            expect(res).to.have.status(204)
        });
    });
    
    it('should update a blog post on PUT', function(){
        const updatePost = {
            title: 'Worst Post Ever',
            content: 'This is the worst post ever',
            author: 'That guy',
            publishDate: Date.now()
        };
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            updatePost.id = res.body[0].id;
            return chai.request(app)
                .put(`/blog-posts/${updatePost.id}`)
                .send(updatePost);
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
    });

})