const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
    res.json(persons);
});

app.get('/info', (req, res) => {
    const page = `<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`;
    res.send(page);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => Number(person.id) === id);
    
    if(!person) {
        return res.status(404).json({
            error: "no such person"
        });
    }
    
    isPerson(req, res, id, person => {
        res.json(person);
    });

}); 

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    isPerson(req, res, id, person => {
        persons = persons.filter(person => Number(person.id) !== id);
        res.json(person);
    });
});

app.post('/api/persons', (req, res) => {
    const person = req.body;

    const generateId = () => {
        let newId = 1;

        while(persons.some(person => Number(person.id) === newId)) {
            newId = Math.floor(Math.random() * 10000 + 1);
        }
        
        return String(newId);
    }

    if(!person || !person.name || !person.number) {
        return res.status(400).json({
            error: "syntax error: request incomplete"
        });
    };

    if(persons.some(existingPerson => existingPerson.name === person.name)) {
        return res.status(405).json({
            error: "name must be unique"
        });
    };

    const newPerson = { id: generateId(), ...person };
    persons = [...persons, newPerson];

    res.json(newPerson);

});

const PORT = process.env.PORT || '3001';
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
