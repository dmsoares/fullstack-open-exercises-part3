const express = require('express');
const app = express();

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
    const person = persons.find(person => person.id === id);

    if(!person) {
        return res.status(404).json({
            error: "no such person"
        });
    }

    callback(person);
}

app.get(`/`, (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const page = `<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`;
    res.send(page);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    
    if(!person) {
        return res.status(404).json({
            error: "no such person"
        });
    }
    
    isPerson(req, res, id, person => {
        res.json(person);
        console.log(person);
    });

}); 

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    isPerson(req, res, id, person => {
        persons = persons.filter(person => person.id !== id);
        res.json(person);
        console.log(`${person.name} was deleted!`);
    });
});


const PORT = '3001';
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
