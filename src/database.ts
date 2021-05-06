var mysql = require('mysql');

var pool: any;

const databaseQuery = async (queryString: string, callback: any): Promise<void> => {

    if (!pool) {
        pool  = await mysql.createPool({
            connectionLimit : 10,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: 3306
        });
    }

    console.log(pool);

    pool.query(queryString, (error: any, results: any) => {
        if (error) {
           callback(true, []);
        } else {
            callback(false, results);
        }
    });
}

export default databaseQuery;