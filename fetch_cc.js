const https = require('https');
const fs = require('fs');

const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ2ODUzOTBkZmE1ZTQxNDc5MzFkN2MzYWFhNjFkMGUwEgsSBxCZmaP56RYYAZIBIwoKcHJvamVjdF9pZBIVQhMyNTM2NDIxNzczNTExMjg0NjU1&filename=&opi=96797242';

function fetchUrl(targetUrl) {
    https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            fetchUrl(res.headers.location);
        } else {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                fs.writeFileSync('D:\\COLLEGE AND LEARNING - D\\webdevs\\TestPilot AI\\cc.html', data);
                console.log("File saved to cc.html, size: " + data.length);
            });
            res.on('error', err => console.error(err));
        }
    }).on('error', err => console.error(err));
}

fetchUrl(url);
