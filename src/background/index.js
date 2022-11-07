console.log('BACKGROUND SCRIPT');

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, details)
            .catch(err => console.log(err))
    })
    console.log(details);
})