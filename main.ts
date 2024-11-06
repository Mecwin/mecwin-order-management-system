import { connectToDataBase } from "./database";
import { app } from "./app";
import { runSeedUsers } from "./utils/authentication";
connectToDataBase().then((res) => {
  if (res) {
    app.listen(process.env.PORT, () => {
      console.log("server is running on the port ", process.env.PORT);
    });
    runSeedUsers();
  } else {
    console.log("failed to connect to the data base ");
  }
});
