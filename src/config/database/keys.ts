const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGOBD_PASSWORD;
const dbname = process.env.MONGOBD_NAME || 'myschedule';

const convertedUsername = encodeURIComponent(username!);
const convertedPassword = encodeURIComponent(password!);
const appName = dbname.charAt(0).toUpperCase() + dbname.slice(1);

export const MongoURI = `mongodb+srv://${convertedUsername}:${convertedPassword}@myschedule.xutyw.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;
export const LocalMongoURI = `mongodb://localhost:27017/${dbname}`;
