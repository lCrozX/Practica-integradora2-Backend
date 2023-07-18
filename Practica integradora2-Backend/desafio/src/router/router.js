import express from "express";
import passport from "passport";
import Authenticated from "../middlewares/middlewars.js";

//Array de productos en memoria
let productos = [];

const router = express.Router();

router.post("/login", passport.authenticate("login", {failureRedirect: "/faillogin"}), (req, res) => {
        res.redirect("/");
    }
);

router.post("/register", passport.authenticate("register", {failureRedirect: "/failregister"}),(req, res) => {
        res.redirect("/");
    }
);


router.get("/failregister", (req, res) => {
    res.render("register-error", {});
});

router.get("/faillogin", (req, res) => {
    res.render("login-error", {});
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/logout", (req, res) => {
    const {username} = req.user;
    req.logout();
    res.render("logout", {
        username
    });
});

router.get("/login", Authenticated, (req, res) => {
    res.render("login");
});
router.get("/", Authenticated, (req, res) => {
    res.redirect("login");
});


//Un formulario de carga de productos en la ruta raíz (configurar la ruta '/productos' para recibir el POST, y redirigir al mismo formulario). //
router.post('/productos', (req, res) => {
    const { producto, precio, urlImagen } = req.body;
    productos.push({ producto, precio, urlImagen });
    res.render("home", { productos, username: req.user.username })

});


export default router;