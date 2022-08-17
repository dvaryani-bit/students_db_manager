const express = require("express");
const uuid = require("uuid");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

console.log("hello");

function generateID(initialLetter, c) {
  firstI = initialLetter.toUpperCase();
  if (c.toString().length < 5) {
    c = firstI + "0".repeat(5 - c.toString().length) + c.toString();
  } else {
    c = firstI + c.toString();
  }
  return c;
}

app.get("/", (req, res) => {
  data = require("./MOCK_DATA.json");
  const lastID = data.length;

  c = 0;
  for (i of data) {
    c += 1;
    i.id = generateID(i.firstName[0], c);
  }
  //var json = JSON.stringify(data);
  //fs = require("./MOCK_DATA.json")
  //fs.writeFile('./MOCK_DATA.json', json);

  message = `

    Welcome to students app:
    <br>
    1) Shows list of APIs:
    <br>  
        GET         http://localhost:${port}/         
    <br>
    <br>
    2) Return the full list of the students (no sorting specified)
    GET        http://localhost:${port}/api/students
    <br>
    this API can accept sorting queryStrings like sort = grade & order = asc|desc
    <br>
    GET     Example:     http://localhost:${port}/api/students?sort=gpa&order=desc
    <br>
    <br>
    3) Filter students based on keys like id|name|major and order = asc|desc
    <br>
    GET        http://localhost:${port}/api/students/filter?major=art
    <br>
    <br>
    4) Returns a student by id
    <br>
    GET        http://localhost:${port}/api/students/:id
    <br>
    <br>
    5) Insert a new student submitted in the request body
    POST       http://localhost:${port}/api/students
    <br>
    <br>
    6) Update an existing student id with the submitted data in the request body
    <br>
    PUT:    http://localhost:${port}/api/students/:id
    <br>
    <br>
    7)deletes the student by id
    <br>
    DELETE:    http://localhost:${port}/api/students/:id


    
    `;
  res.send(message);
});

function getStudents(data) {
  const data2 = Array();
  for (i of data) {
    j = {};
    j.id = i.id;
    j.name = i.firstName + " " + i.lastName;
    j.email = i.email;
    j.majors = i.majors;
    var total = 0;
    for (x in i.subjects[0]) {
      total += i.subjects[0][x];
    }
    avg = total / Object.keys(i.subjects[0]).length;
    j.grade = +avg.toFixed(2);
    data2.push(j);
  }
  return data2;
}

app.get("/api/students", (req, res) => {
  data = require("./MOCK_DATA.json");
  for (i of data) {
  }
  data = getStudents(data);
  //console.log(data)
  const sort = req.query.sort;
  const order = req.query.order;
  console.log(sort);
  console.log(order);
  //res.send([sort,order])

  if (sort) {
    console.log([sort]);
    console.log(sort in ["id", "grade", "name", "majors", "email"]);
    if (!["id", "grade", "name", "majors", "email"].includes(sort)) {
      res.status(404).send("Fix sort key");
    }
    if (order) {
      if (!["asc", "desc"].includes(order)) {
        res.status(404).send("Fix order key");
      }
      if (order === "asc") {
        data.sort((a, b) => a[sort] - b[sort]);
      } else {
        data.sort((a, b) => b[sort] - a[sort]);
      }
    } else {
      data.sort((a, b) => a[sort] - b[sort]);
    }
  }
  res.send(data);
});

app.get("/api/students/filter", (req, res) => {
  const input = req.query.major;
  const data = require("./MOCK_DATA.json");
  if (input) {
    const results = data.filter((x) => x.majors.toLowerCase().includes(input));
    res.send(results);
  } else {
    res.send("No search term included");
  }
});

app.get("/api/students/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id_input = req.params.id;
  console.log(id_input);
  console.log(data.splice(0, 4));
  const result = data.find((x) => x.id === id_input);
  if (result) {
    res.send([result]);
  } else {
    res.status(404).send("Student ID not in data");
  }
});

app.post("/api/students", (req, res) => {
  if (!req.body.id) {
    res.status(400).send("No student id entered");
  }
  const data = require("./MOCK_DATA.json");
  var items = [];
  for (i of data) {
    id = i.id;
    num = id.slice(1, 6);
    items.push(parseInt(num));
  }
  console.log(items);

  counter = Math.max.apply(null, items) + 1;
  console.log(counter);
  if (req.body.firstName) {
    i = req.body.firstName[0];
  } else {
    i = "Z";
  }
  const student = {
    id: generateID(i, counter),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    majors: req.body.majors,
    subjects: req.body.subjects,
  };
  data.push(student);
  res.send(student);
});

app.put("/api/students/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id = req.params.id;
  const student = data.find((x) => x.id === id);
  if (!id) {
    res.status(400).send("No student id entered");
  }

  if (!student) {
    res.status(404).send("Student ID not in data");
  }

  if (req.body.firstName) {
    student.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    student.lastName = req.parabodyms.lastName;
  }
  if (req.body.email) {
    student.email = req.body.email;
  }
  if (req.body.majors) {
    student.majors = req.body.majors;
  }
  if (req.body.subjects) {
    student.subjects = req.body.subjects;
  }
  res.send(student);
});

app.delete("/api/students/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id = req.params.id;
  const student = data.find((x) => x.id === id);
  if (!student) {
    res.status(404).send("Student ID not in data");
  } else {
    const index = data.indexOf(student);
    data.splice(index, 1);
    res.send(student);
  }
});
