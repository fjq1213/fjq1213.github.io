const url = "https://en.wiktionary.org/api/rest_v1/page/html/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        console.log(doc);
        const russianContent = doc.querySelector('#Russian')
        if (russianContent) {
            const sectionContent = russianContent.parentElement;
            result.innerHTML = sectionContent.outerHTML;
        } else {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        }
    }).catch(() => {
        result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    });
});
