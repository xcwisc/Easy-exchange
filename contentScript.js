// function to get the highlighted text
function getSelectionText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

// send the message to the background to get the converted value
function getTarget(text) {
  chrome.runtime.sendMessage({
    action: "getTarget",
    text: text
  }, function(response) {
    if (response.status) {
      chrome.storage.sync.get(["base", "target"], (items) => {
        let base = items["base"];
        let target = items["target"];
        let val = response.val.toFixed(2);
        alert(`${text} ${base} = ${val} ${target}`);     
      });
    } else {
      alert("Please select a number");
    }
  })
}

// starting wrapper
function start() {
  let text = getSelectionText();
  getTarget(text);
}
start();
