require("dotenv").config();
const pool = require("../connection/sqlConnection");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs').promises;

exports.getUsers = async (req, res, next) => {
    try {
        const [users] = await pool.execute(`SELECT * FROM users`);
        if (users.length === 0) { return res.status(200).json({ users: [] }) };
        return res.status(200).json({ users: users });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

exports.getOneUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const [users] = await pool.execute(`SELECT id, name, img_url, role FROM users WHERE id = ?`, [id]);
        if (users.length === 0) { return res.status(200).json({ users: [] }) };
        return res.status(200).json({ user: users[0] });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


exports.getMyPfofil = async (req, res, next) => {
    try {
        const id = req.auth.userId;
        const [users] = await pool.execute(`SELECT name, img_url, id, role FROM users WHERE id = ?`, [id]);
        if (users.length === 0) { return res.status(200).json({ users: [] }) };
        return res.status(200).json({ user: users[0] });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


exports.inscription = async (req, res, next) => {
    try {
        const magicWord = req.body.magicWord;
        if (!magicWord || magicWord !== process.env.MAGIC_WORD) {
            return res.status(400).json({ msg: "Invalid magic word" })
        }

        // Vérification des champs
        if (!req.body.name || !req.body.password || !req.body.magicWord) return res.status(400).json({ msg: "All fields are required" });

        // Attendre que le hash du mot de passe soit généré
        const hash = await bcrypt.hash(req.body.password, 10);

        // Créer un nouvel utilisateur
        const user = {
            id: uuidv4(),
            name: req.body.name,
            password: hash,
            img_url: req.file ? req.file.filename : "smiley_sans_fond.png"
        };

        const [existingUser] = await pool.execute('SELECT * FROM users WHERE name = ?', [req.body.name]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: "Name is already taken" });
        }

        // Insérer l'utilisateur dans la base de données
        const [results] = await pool.execute('INSERT INTO users (id, name, password, img_url) VALUES (?,?,?,?)', [user.id, user.name, user.password, user.img_url]);

        // Répondre avec un message de succès
        return res.status(201).json({ msg: "user created", id: results.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

exports.connection = async (req, res, next) => {
    const { name, password } = req.body;
    // Vérification des champs
    if (!name || !password) return res.status(400).json({ msg: "All fields are required" });

    // Vérification de l'existance du mail
    const [user] = await pool.execute('SELECT * FROM users WHERE name=?', [name]);
    if (!user[0] || !user[0].name) {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/' // supprimer le cookie pour TOUS les chemins
        });
        return res.status(400).json({ msg: "Non existant name" });
    }


    // Vérification du mdp
    const isPassword = await bcrypt.compare(password, user[0].password);
    if (!isPassword) {

        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/' // supprimer le cookie pour TOUS les chemins
        });

        return res.status(400).json({ msg: "Password invalid" });
    }

    // Modification de la table user pour indique que l'utilisateur est connecté:
    await pool.execute('UPDATE users SET isConnected = ? WHERE id = ?', [1, user[0].id]);

    const token = jwt.sign(
        { userId: user[0].id, isAdmin: user[0]._isAdmin },
        `${process.env._SECRET_KEY}`,
        { expiresIn: "24h" }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    // Envoie du token dans un cookie sécurisé HttpOnly  
    res.cookie('authToken', token, {
        httpOnly: true, // Le cookie ne peut pas être accédé par JavaScript
        secure: isProduction,   // Le cookie est envoyé uniquement sur HTTPS  // pendant la production => secure: 'production' // en ligne: secure: true
        maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (24h)
        sameSite: 'None', // Protection contre les attaques CSRF   // sameSite: 'Strict' 
        partitioned: true,
        path: "/"
    });

    res.status(200).json({ msg: "Connection sucessful" });
};


exports.isConnected = async (req, res, next) => {
    try {
        if (req.auth.userId) return res.status(200).json({ isUser: true });
    } catch (err) {
        res.status(500).json({ error: err })
    }
};

exports.disconnect = async (req, res, next) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        return res.status(200).json({ msg: "Vous êtes désormais déconnecté" });
    } catch (err) {
        return res.status(500).json({ error: "Erreur serveur lors de la déconnexion" });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const authId = req.auth.userId;
        const { name, password, role } = req.body;

        const [userArr] = await pool.execute("SELECT img_url from users WHERE id = ?", [authId]);
        const user = userArr[0];

        const data = {
            name: name || null,
            password: password || null,
            role: role || null,
            img_url: req.file ? req.file.filename : null
        }

        const keys = Object.keys(data).filter((val) => data[val] !== null);
        const values = Object.values(data).filter((val) => val !== null);
        const placeholder = keys.map((key) => `${key} = ?`).join(", ");
        values.push(authId);


        await pool.execute(`UPDATE users SET ${placeholder} WHERE ID = ?`, values);

        // Si file, suppression de l'image
        if (data.img_url) {
            try {
                if (data.img_url !== "smiley_sans_fond.png" && user.img_url !== "smiley_sans_fond.png") {
                    await fs.unlink(`uploads/pictures/avatars/${user.img_url}`);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de l'ancienne image:", err);
                return res.status(500).json({ msg: "Error deleting old image", error: err });
            }
        }
        return res.status(200).json({ msg: "User updated" })

    } catch (err) {
        return res.status(500).json({ error: err })
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, passwordConfirmation } = req.body;
        if (!oldPassword || !newPassword || !passwordConfirmation) return res.status(400).json({ msg: "all fields required" });
        const [userArr] = await pool.execute("SELECT * from users WHERE id = ?", [req.auth.userId]);
        const user = userArr[0];
        const isPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isPassword) return res.status(400).json({ msg: "Password incorect" });
        if (newPassword !== passwordConfirmation) return res.status(400).json({ msg: "The passwords do not match" });
        const hash = await bcrypt.hash(req.body.newPassword, 10);
        await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hash, req.auth.userId]);
        return res.status(200).json({ msg: "Password modified" });
    } catch (err) {

    }
};

