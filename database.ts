import { Op, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  port: 5432,
  logging: false,
});

export async function connectToDataBase() {
  try {
    await sequelize.authenticate({
      logging: false,
    });
    console.log("successfully connected to database ");
    await runAllMigrationFiles();
    return sequelize;
  } catch (error) {
    console.log("failed to connect to data base ", (error as Error).message);
  }
}

export async function runAllMigrationFiles() {
  try {
    const umzug = new Umzug({
      logger: console,
      context: sequelize,
      storage: new SequelizeStorage({
        sequelize,
      }),
      migrations: {
        glob: [
          "./migrations/*.js",
          {
            cwd: __dirname,
          },
        ],
      },
    });
    await umzug.up();
    console.log("sussessfully runned all the migration files ");
    // const down = await umzug.down();
    // if (down) {
    //   console.log("successfully reverted all the migration files ");
    // }
  } catch (error) {
    console.log("error came while running migration files ", error);
  }
}

export default sequelize;
