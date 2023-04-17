Aadil's News API

This is an news app that has articles where you can leave comments. You can access the app using the link below:

https://news-4j2x.onrender.com/api

Available URLs (Endpoints)
/api/topics - responds with an array of all topics

/api/articles - responds with an array of all articles

/api/articles/:articleId - responds with an article object when provided a valid article ID

/api/articles/:articleId/comments - responds with an comments object when provided a valid article ID

/api/users - responds with an array of user objects

POST and DELETE Endpoints

POST /api/articles/:articleId/comments - posts a comments object relating to an article when provided a valid body and article ID

DELETE /api/articles/:articleId/comments - deletes a comments object relating to an article when provided a valid comment ID

Cloning this project

git clone - https://github.com/invigocode/be-nc-news

Create a file called .env.test and write PGDATABASE=<nc_news_test> inside.

Create another file called .env.development and write PGDATABASE=<nc_news> inside.

To set-up and seed your database with the correct data run the commands: $ npm run setup-dbs then $ npm run seed

To run tests for the project:

$ npm test
