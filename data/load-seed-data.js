require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import our seed data:
const todos = require('./todos');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        await client.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2);
                `,
        ['christmas@chris.com', 'aaaaa']);
       

        await Promise.all(
            todos.map(todo => {
                return client.query(`
                    INSERT INTO todos (task, complete, user_id)
                    VALUES ($1, $2, $3);
                `,
                [todo.task, todo.complete, todo.user_id]);
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}