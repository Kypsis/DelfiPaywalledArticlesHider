const getStuff = () =>
  fetch(
    "http://ec2-18-185-111-192.eu-central-1.compute.amazonaws.com:3000/delfi"
  ).then(response => console.log(response).catch(error => console.log(error)));
getStuff();
