const fs = require('fs');
const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ2ODUzOTBkZmE1ZTQxNDc5MzFkN2MzYWFhNjFkMGUwEgsSBxCZmaP56RYYAZIBIwoKcHJvamVjdF9pZBIVQhMyNTM2NDIxNzczNTExMjg0NjU1&filename=&opi=96797242';

fetch(url)
  .then(res => res.text())
  .then(text => fs.writeFileSync('command_center.html', text))
  .catch(console.error);
