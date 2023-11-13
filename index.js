process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const fs = require('fs')
const path = require('path')
const axios = require('axios').default

const dataBlob = fs.readFileSync(path.join(process.cwd(), 'blob.txt'), 'utf-8')
const blobWithLine = dataBlob.split('\r\n')
const blobHeader = blobWithLine[0].split('|')
const blobBody = blobWithLine.slice(1)
const blobList = blobBody.map(body => body.split('|'))
const blobJSON = []

for(let i=1;i<blobList.length-1; ++i) {
  const body = {};
  for(let headerIndex = 0; headerIndex < blobHeader.length; headerIndex++) {
    const header = blobHeader[headerIndex];
    body[header] = blobList[i][headerIndex];
  }
  blobJSON.push(body);
}

// console.log('blobJSON: ', blobJSON);
// fs.writeFileSync('./JSONBlob.json', JSON.stringify(blobJSON), 'utf-8')
const reqBody = {
  "platform": "Lazada",
  "type": "OMS",
  "orders": blobJSON
}

const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGI5MWY4ZGItYzJkMy00NmIyLTlhMjAtZWYxMzk0MTgwY2ExIiwicHVibGljX2lkIjoiY2hhbnRhdGhhLnBAZW50cm9uaWNhLmNvLnRoIiwicHVibGljX2lkX3R5cGUiOiJlbWFpbCIsInJvbGUiOiJ1c2VyIiwicGFydG5lcl9pZCI6InFyd2RRRXE4SSIsImV4cCI6MTY5OTg1NDYwNywic2NvcGUiOlsiZnVsbC1hY2Nlc3MiXSwiaWF0IjoxNjk5NzY4MjA3fQ.3FCkFeJSQ3B7yRiDmdumw4CM5V9Jw9kDAkJ46N2PQII'
}

axios.post('https://rr-consolidator.io/service-cs/api/orders/blob', reqBody, { headers }).then(res => {
  console.log(res.data)
}).catch(e => {
  console.error(e.data)
})
