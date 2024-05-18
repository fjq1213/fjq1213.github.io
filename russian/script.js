const url = "https://en.wiktionary.org/api/rest_v1/page/html/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

const transliterationRules = [
    { en: 'shch', ru: 'щ' },
    { en: 'yo', ru: 'ё' },
    { en: 'zh', ru: 'ж' },
    { en: 'ch', ru: 'ч' },
    { en: 'sh', ru: 'ш' },
    { en: 'yu', ru: 'ю' },
    { en: 'ya', ru: 'я' },
    { en: 'ts', ru: 'ц' },
    { en: 'a', ru: 'а' },
    { en: 'b', ru: 'б' },
    { en: 'v', ru: 'в' },
    { en: 'g', ru: 'г' },
    { en: 'd', ru: 'д' },
    { en: 'ye', ru: 'е' },
    { en: 'z', ru: 'з' },
    { en: 'i', ru: 'и' },
    { en: 'j', ru: 'й' },
    { en: 'k', ru: 'к' },
    { en: 'l', ru: 'л' },
    { en: 'm', ru: 'м' },
    { en: 'n', ru: 'н' },
    { en: 'o', ru: 'о' },
    { en: 'p', ru: 'п' },
    { en: 'r', ru: 'р' },
    { en: 's', ru: 'с' },
    { en: 'c', ru: 'с' },
    { en: 't', ru: 'т' },
    { en: 'u', ru: 'у' },
    { en: 'f', ru: 'ф' },
    { en: 'h', ru: 'х' },
    { en: 'x', ru: 'х' },
    { en: 'y', ru: 'ы' },
    { en: 'e', ru: 'э' },
    { en: "'", ru: 'ь' },
    { en: "`", ru: 'ъ' }
];

function transliterate(word) {
    let result = '';
    let i = 0;

    while (i < word.length) {
        let matchFound = false;

        // Iterate through all rules
        for (const rule of transliterationRules) {
            // Check if the current part of the word matches any transliteration rule
            if (word.startsWith(rule.en, i)) {
                result += rule.ru;
                i += rule.en.length;
                matchFound = true;
                break;
            }
        }

        // If no match is found, just add the current character as is
        if (!matchFound) {
            result += word[i];
            i++;
        }
    }

    return result;
}

btn.addEventListener("click", () => {
    let inpWord = transliterate(document.getElementById("inp-word").value);
    console.log(inpWord);
    result.innerHTML = `<h4 class="word">${inpWord}</h4?`
    fetch(`${url}${inpWord}`).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        console.log(doc);
        const russianContent = doc.querySelector('#Russian')
        if (russianContent) {
            const sectionContent = russianContent.parentElement;
            result.innerHTML += sectionContent.outerHTML;
        } else {
            result.innerHTML += `<h3 class="error">Couldn't Find The Word</h3>`;
        }
    }).catch(() => {
        result.innerHTML += `<h3 class="error">Couldn't Find The Word</h3>`;
    });
});
