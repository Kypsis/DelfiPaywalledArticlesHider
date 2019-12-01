// Listen for links from content.js and store new links
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const delfiPaywalledLinks = await fetch(
    "http://ec2-18-185-111-192.eu-central-1.compute.amazonaws.com:3000/delfi"
  )
    .then(response => response.json())
    .then(links => links.filter(link => link.Paywalled === true))
    .catch(error => console.log(error));

  const postimeesPaywalledLinks = await fetch(
    "http://ec2-18-185-111-192.eu-central-1.compute.amazonaws.com:3000/postimees"
  )
    .then(response => response.json())
    .then(links => links.filter(link => link.Paywalled === true))
    .catch(error => console.log(error));

  const paywalledLinks = [
    ...new Set([...delfiPaywalledLinks, ...postimeesPaywalledLinks])
  ].map(item => item.Url);
  console.log("Combined paywalled links length: ", paywalledLinks.length);

  // Send paywalled links to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      paywallList: paywalledLinks
    });
  });
});
