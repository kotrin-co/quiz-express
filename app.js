const express = require('express');
const router = require('./router/index');
const port = 3001;

const app = express();

app.use('/',router);
app.use(express.static('public'));
app.set('view engine','ejs');

app.listen(port,()=>console.log(`exapmle app listening on port ${port}`));

