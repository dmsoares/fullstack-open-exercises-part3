require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person.js');

morgan.token('postData', req => JSON.stringify(req.body));

const app = express();

app
    .use(express.json())
    .use(cors())
    .use(express.static('build'))
    .use(morgan((tokens, req, res) => {
        const log = [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
            ].join(' ');
        return req.method === 'POST' ? [log, tokens.postData(req)].join(' ') : log;
    }));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

const isPerson = (req, res, id, callback) => {
    const person = persons.find(person => Number(person.id) === id);

    if(!person) {
        return res.status(404).json({
            error: "no such person"
        });
    }

    callback(person);
}

app.get(`/api/persons`, (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/info', (req, res) => {
    const page = `<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`;
    res.send(page);
});

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params;

    Person.findById(id)
        .then(person => {
            if (person) return res.json(person);
            res.status(404).end();
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({error: 'malformatted id'});
        });
}); 

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params;

    Person.findByIdAndRemove(id)
        .then(person => {
            res.status(204).end();
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'malformatted id' });
        });
});

app.post('/api/persons', (req, res) => {
    const person = req.body;

    if(!person || !person.name || !person.number) {
        return res.status(400).json({
            error: "syntax error: request incomplete"
        });
    };

    const newPerson = new Person({ name: person.name, number: person.number });

    newPerson.save().then(person => res.json(person)); 
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
