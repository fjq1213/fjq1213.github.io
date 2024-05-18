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
            console.log(russianContent.innerHTML);
            const sectionContent = russianContent.parentElement;
            result.innerHTML = sectionContent.outerHTML;
            console.log(sectionContent.innerHTML);
            console.log(sectionContent.outerHTML);
        } else {
            console.log('Not found in Russian!');
        }
        // result.innerHTML = `
        //     <div class="word">
        //         <h3>${inpWord}</h3>
        //         <button onclick="playSound()">
        //             <i class="fa fa-volume-up" style="color: #ac99ff;"></i>
        //         </button>
        //     </div>
        //     <div class="details">
        //         <p>${data[0].meanings[0].partOfSpeech}</p>
        //         <p> . ${data[0].phonetic}</p>s
        //     </div>
        //     <p class="word-meaning">
        //         ${data[0].meanings[0].definitions[0].definition}
        //     </p>
        //     <p class="word-example">
        //         ${data[0].meanings[0].definitions[0].example || ""}
        //     </p>`;
        // sound.setAttribute("src", `https:${data[0].phonetics[0].audio}`);

    })

        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});
