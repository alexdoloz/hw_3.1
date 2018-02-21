const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/netology_db';

MongoClient.connect(url, (err, database) => {
    if (err) { throw err; }
    console.log(`Connected to "${database.s.options.dbName}"`);
    makeSomeActionsWithDB(database);
});


function makeSomeActionsWithDB(database) {
    const db = database.db("netology_db");
    const users = db.collection('users');
    const usernames = ["Alex", "Brad", "Chad", "Derek"];
    const userObjects = usernames.map(name => { return { name, gender: "m" }; });

    // Добавляем
    users.insert(userObjects, (err, result) => {
        if (err) { throw err; }
        console.log('---');
        console.log(`Result of insert: ${JSON.stringify(result)}`);
        // Отображаем
        users.find().sort({ name: 1 }).toArray((err, result) => {
            if (err) { throw err; }
            console.log('---');
            console.log(`Result of find: ${JSON.stringify(result)}`);
            // Меняем имя у первых двух
            assert(result.length >= 2, "Can't rename first two users");
            const updateQuery = { $or: [{ _id: result[0]._id }, { _id: result[1]._id }] };
            users.update(updateQuery, { $set: { name: "RENAMED USER" } }, (err, result) => {
                if (err) { throw err; }
                console.log('---');
                console.log(`Result of update: ${JSON.stringify(result)}`);
                // Проверяем
                users.find().toArray((err, result) => {
                    if (err) { throw err; }
                    console.log('---');
                    console.log(`Find after update: ${JSON.stringify(result)}`);
                    // Удаляем
                    users.remove(updateQuery, (err, result) => {
                        if (err) { throw err; }
                        console.log('---');
                        console.log(`Result of remove: ${JSON.stringify(result)}`);
                        database.close();
                        console.log('DB Closed');
                    });
                });
            });
        });
    });
}


