const mongoose = require('mongoose');

if (process.argv.length < 3) { console.log('Please enter your password as an argument.\nYou can add a new entry to the phonebook by specifying the following arguments: <name> <number>. If <name> contains whitespace characters, enclose it in "".\nIf no arguments besides your password are passed, the app will return current phonebook entries'); process.exit(1);
}

const password = process.argv[2];

const url = 
    `mongodb+srv://fullstack:${password}@cluster0.zd3ku.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    person.save().then(result => {
        console.log(`${person.name} was added to the phonebook!`);
        mongoose.connection.close();
    });
} else {
    Person.find({}).then(result => {
        console.log(result);
        mongoose.connection.close();
    });
}
