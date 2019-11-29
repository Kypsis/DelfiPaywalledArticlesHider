// Restrict page action (icon grayed out) to only delfi.ee and postimees.ee
// BUGGED. TODO: check why the click functionality on icon bugs out.
/* chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: ["*.delfi.ee/*", "*.postimees.ee/*"] }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
}); */

// Listen for links from content.js and store new links
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("Background loop");

  const delfiPaywalledLinks = await fetch(
    "http://ec2-18-185-111-192.eu-central-1.compute.amazonaws.com:3000/delfi"
  )
    .then(response => response.json())
    .then(links => links.filter(link => link.Paywalled === true));
  console.log("Delfi paywalled links: ", delfiPaywalledLinks.length);

  const postimeesPaywalledLinks = await fetch(
    "http://ec2-18-185-111-192.eu-central-1.compute.amazonaws.com:3000/delfi"
  )
    .then(response => response.json())
    .then(links => links.filter(link => link.Paywalled === true));
  console.log("Postimees paywalled links: ", delfiPaywalledLinks.length);

  // Send paywalled links to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      paywallList: paywalledLinks
    });
  });
});
