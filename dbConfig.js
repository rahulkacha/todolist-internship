const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todolistdb",
  port: 3308,
};

module.exports.dbConfig = dbConfig;
