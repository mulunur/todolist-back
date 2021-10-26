const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const {
    Sequelize,
    DataTypes
} = require('sequelize');
//const Op = db.Sequelize.Op;

let array = [];

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


const sequelize = new Sequelize('postgres://postgres:8909@localhost:5432/todo-list')

const func = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
func();

const ToDo = sequelize.define('ToDo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, {});

sequelize.sync().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
console.log(ToDo === sequelize.models.ToDo);


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./file');
}


app.get('/', (req, res) => {
    ToDo.findAll().then(ToDos => {
        res.status(200).json({ToDos});
    }).catch(function (err) {
        console.log("findAll failed with error: " + err);
        return null;
    });
})

app.get('/:index', (req, res) => {
    const id = req.params.index;
    ToDo.findByPk(id).then(ToDos => {
        res.status(200).json({ToDos});
    }).catch(function (err) {
        console.log("findAll failed with error: " + err);
        return null;
    });
})


app.patch('/:index', (req, res) => {
    const id = req.params.index;
    ToDo.update({ title: req.body.title, description: req.body.description },
        { where: { id: id } }
    ).then(() => {
        res.status(200).json({message: 'OK patch'});
    }).catch(function (err) {
        res.status(500).json({message: 'Опаньки...'});
        console.log("update failed with error: " + err);
        return 0;
    });
});

app.post('/', (req, res) => {
    ToDo.create({
        title: req.body.title,
        description: req.body.description
    }).then(ToDo => {
        res.status(200).json(ToDo);
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
})


app.delete('/:index', (req, res) => {
    const id = req.params.index;
    ToDo.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({msg:'объект ' + id + ' удалён'});
    }).catch(function (err) {
        console.log("delete failed with error: " + err);
        return 0;
    });
})

app.delete('/', (req, res) => {
    ToDo.destroy({
        truncate: true
    }).then(() => {
        res.status(200).json({msg:'список удалён'});
    }).catch(function (err) {
        console.log("delete failed with error: " + err);
        return 0;
    });
})

http.createServer(app).listen(3000, () => {
    console.log('Server is working on port 3000');
})
