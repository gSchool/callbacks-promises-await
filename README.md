# callbacks-promises-await
3 ways of doing the exact same async function call: callbacks, Promises, and async/await

Simple Express server with the same Postgres database query done 3 ways, for purpose of understanding how await/async is really Promises is really just plain old callbacks.

If you have a Postgres database with a `users` table the queries/server should actually work.

- `npm install`
- `npm start`
- Make an HTTP GET to `http://localhost:3000/users`
