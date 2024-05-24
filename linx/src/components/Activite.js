const url = "https://www.lilletourism.com/explorer/hello-culture/agenda/";

fetch(url, {
    method: 'POST'
})
.then(response => response.text())
.then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const imgSrc = doc.querySelector('alt').src;
    const imgData = imgSrc.split(",")[1];
    print(imgData)

})
.catch(error => console.error('Erreur:', error));
