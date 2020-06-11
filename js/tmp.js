var url =
  "http://localhost/audio/?email=test2%40test2.com&fbclid=IwAR10RAR5D3LypDOhwVvrrGof9VbwVrc31o-Iz4qVpqCcdcheFHrqLjE2knE";
var url = window.location.href;
var str = window.location.search;
var subres = JSON.parse(JSON.stringify(str.split("=")));
var string = subres[1].split("&");
var emailAddress = string[0].replace(/%40/g, "@");
console.log(emailAddress);

console.log(`https://evermind.online/chronicle-share/?email=${emailAddress}`);
