import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import router from "./src/router/router.js";
import { User } from "./src/models/user.js";
import * as strategy from "./src/passport/strategy.js";

const MONGO_DB_URI = 'mongodb+srv://admin:admin@cluster0.ddkqi7v.mongodb.net/test';
const app = express();
app.use(cookieParser());

// ----------------------Configurando connect-mongo---------------------------//
app.use(session({
    store:MongoStore.create({
      mongoUrl: MONGO_DB_URI,
      ttl:600, // Session setiada en 10 minutos
      collectionName:'sessions'
  }),
  secret:'secret',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    maxAge: 600000,
  }
  }))
//----------------------------------------------------------------------------//

//------------------------------handlebars-----------------------------------//
app.engine("hbs",handlebars({extname: ".hbs",defaultLayout: "index.hbs",}));
app.set("view engine", "hbs");
app.set("views", "./src/views");
//----------------------------------------------------------------------------//

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);


//--------------------------------passport-----------------------------------//

passport.use(
  "login",
  new LocalStrategy({ passReqToCallback: true }, strategy.login)
);

passport.use(
  "register",
  new LocalStrategy({ passReqToCallback: true }, strategy.register)
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//----------------------------------------------------------------------------//

const PORT = process.env.PORT || 3000;
const srv = app.listen(PORT, async () => {
  console.log(`Servidor http escuchando en el puerto ${srv.address().port}`);
  try {
    await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected DB");
  } catch (error) {
    console.log(`Error en conexión de Base de datos: ${error}`);
  }
});
srv.on("error", (error) => console.log(`Error en servidor ${error}`));

