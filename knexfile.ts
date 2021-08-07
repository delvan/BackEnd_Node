import pach from 'path';

module.exports ={

    client: 'sqlite3',
    connection:{
        filename: pach.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },
    migrations:{
        directory: pach.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
};