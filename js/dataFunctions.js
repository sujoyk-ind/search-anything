export const getSearchTerm = () => {
    const rawSearchTerm = document.getElementById("search").value.trim();
    const regex = /[ ]{2,}/gi;
    const searchTerm = rawSearchTerm.replaceAll(regex, " ");
    return searchTerm;
}

export const retrieveserachResults = async (searchTerm) => {
    const wikiSearchString = getWikiSearchString(searchTerm);
    const wikiSearchResults = await requestData(wikiSearchString);
    let resultArray = [];
    if (wikiSearchResults.hasOwnProperty("query")) {
        resultArray = processWikiResults(wikiSearchResults.query.pages);
    }
    return resultArray;
}

const getWikiSearchString = (searchTerm) => {
    const maxCharacters = getMaxChars();
    const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxCharacters}&exintro&explaintext&exlimit=max&format=json&origin=*`;

    const searchString = encodeURI(rawSearchString);
    return searchString;
}

const getMaxChars = () => {
    const width = window.innerWidth || document.body.clientWidth;
    let maxCharacters
    if (width < 414) {
        maxCharacters = 65;
    }
    if (width >= 414 && width < 1400) {
        maxCharacters = 100;
    }
    if (width >= 1400) {
        maxCharacters = 130;
    }
    return maxCharacters;
}

const requestData = async (searchString) => {
    try {
        const response = await fetch(searchString);
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err)
    }
}

const processWikiResults = (results) => {
    const resultArray = [];
    Object.keys(results).forEach(key => {
        const id = key;
        const title = results[key].title;
        const text = results[key].extract;
        const img = results[key].hasOwnProperty("thumbnail")
            ? results[key].thumbnail.source
            : null;
        const item = {
            id: id,
            title: title,
            img: img,
            text: text
        }
        resultArray.push(item)
    });
    return resultArray;
}