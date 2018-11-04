const url = "http://data.fixer.io/api/latest?access_key=0e7f0816f802444eabf5898cc605bfde";
// set the default storage
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({base: "USD", target: "CNY"}, function() {
    console.log("Hello");
  });
});

// make fixer.io api request to get the currency rate and calculate the exchanged value
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.action === "getTarget") {
    let num = Number(req.text);
    // console.log("request received");
    if (isNaN(num)) {
      sendResponse({status: false, message: "The request text cannot be parsed into number!", val: NaN});
    } else {
      chrome.storage.sync.get(["base", "target"], (items) => {
        let base = items["base"];
        let target = items["target"];
        fetch(url)
          .then((res) => {
            return res.json();
          })
          .then((parsed) => {
            // console.log(parsed);
            // console.log(parsed.rates[target] / parsed.rates[base])
            // console.log(num);
            let result = parsed.rates[target] / parsed.rates[base] * num;
            sendResponse({status: true, message: "Succeeded!", val: result}); 
          })
          .catch(error => console.error('Error:', error));
      });
      return true; // send the response async
    }
  }
});

// log the new changes when the storage is updated
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

// command listener
chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggle") {
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'contentScript.js'});    
    });
  }
});