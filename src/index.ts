import app from "./config/serverConfigs/expressApp";
const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
  console.log("Server is lauched on port: ", PORT, " 🚀🚀🚀");
});