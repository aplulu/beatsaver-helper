const apiURL = 'https://api.beatsaver.com';

const htmlEscape = (value:string): string => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const hookDownloadLinks = (container: Element) => {
    const anchors = container.getElementsByTagName('A');
    for (let anchor of anchors) {
        const href = anchor.getAttribute('href');
        if (href && href.endsWith('.zip')) {
            const hash = href.substr(href.length - 44, 40);

            anchor.addEventListener('click', async (e) => {
                e.preventDefault();

                const resp = await fetch(apiURL + '/maps/hash/' + hash);
                const data = await resp.json();
                const filename = htmlEscape(`${data.id} (${data.metadata.songName} - ${data.metadata.levelAuthorName})`) + '.zip';
                chrome.runtime.sendMessage ({
                    'action': 'download',
                    'url': href,
                    'filename': filename,
                });
            });
        }
    }
};


const main = () => {
    const observer = new MutationObserver(records => {
        for (let record of records) {
            for (const addedNode of record.addedNodes) {
                if (addedNode instanceof HTMLElement) {
                    if (addedNode.classList.contains('search-results')) {
                        const links = addedNode.getElementsByClassName('links');
                        for (let el of links) {
                            hookDownloadLinks(el);
                        }
                    } else if (addedNode.classList.contains("card")) {
                        const links = addedNode.getElementsByClassName('ml-auto');
                        for (let el of links) {
                            hookDownloadLinks(el);
                        }
                    } else {
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
}

main();