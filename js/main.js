import * as OpenCC from './modules/opencc-js/full.js';
import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

const uploadFile = document.querySelector('input[type="file"]');
const convertButton = document.getElementById("convert-button");
const downloadButton = document.getElementById("download-button");
const convertTableButton = document.getElementById("convert-table-button");
const markDiffButton = document.getElementById("mark-diff-button");
const hideShowUnchangedButton = document.getElementById("hide-show-unchanged");
const collapseExpandTagButton = document.getElementById("collapse-expand-tag");
const diffResultTable = document.getElementById("diff-result-table");

const oldTextArea = ace.edit("editor1");
oldTextArea.session.setMode("ace/mode/xml");
oldTextArea.setTheme("ace/theme/monokai");
oldTextArea.setAutoScrollEditorIntoView(true);
oldTextArea.setOption("maxLines", 15);
const newTextArea = ace.edit("editor2");
newTextArea.session.setMode("ace/mode/xml");
newTextArea.setTheme("ace/theme/monokai");
newTextArea.setAutoScrollEditorIntoView(true);
newTextArea.setOption("maxLines", 15);

const origCN = document.getElementById('orig-type-cn');
const origHK = document.getElementById('orig-type-hk');
const origTW = document.getElementById('orig-type-tw');
const origTWP = document.getElementById('orig-type-twp');
const tarCN = document.getElementById('tar-type-cn');
const tarHK = document.getElementById('tar-type-hk');
const tarTW = document.getElementById('tar-type-tw');
const tarTWP = document.getElementById('tar-type-twp');

uploadFile.addEventListener(
    "change",
    () => {
        document.getElementById("upload-filename").innerHTML = uploadFile.files[0].name;
        placeFileContent(oldTextArea, uploadFile.files[0]);
        hideShowUnchangedButton.style.visibility = "hidden";
        collapseExpandTagButton.style.visibility = "hidden";
    },
    false
)

convertButton.addEventListener("click", () => {
    let oldText = oldTextArea.getValue();
    let oldTextChanged;
    let locale1, locale2;

    const regex = /(?<=target-language\=\"zh\-)[a-zA-Z]{2}|(?<=trgLang\=\"zh\_)[a-zA-Z]{2}/gm;

    switch (true) {
        case origCN.checked:
            locale1 = 'cn';
            break;
        case origHK.checked:
            locale1 = 'hk';
            break;
        case origTW.checked:
            locale1 = 'tw';
            break;
        case origTWP.checked:
            locale1 = 'twp';
            break;
    }

    switch (true) {
        case tarCN.checked:
            locale2 = 'cn';
            oldTextChanged = oldText.replace(regex, "CN");
            break;
        case tarHK.checked:
            locale2 = 'hk';
            oldTextChanged = oldText.replace(regex, "HK");
            break;
        case tarTW.checked:
            locale2 = 'tw';
            oldTextChanged = oldText.replace(regex, "TW");
            break;
        case tarTWP.checked:
            locale2 = 'twp';
            oldTextChanged = oldText.replace(regex, "TW");
            break;
    }

    let converter = OpenCC.Converter({ from: locale1, to: locale2 });
    newTextArea.setValue(converter(oldTextChanged), -1);
    let filename = uploadFile.files[0].name;
    let lastDotIndex = filename.lastIndexOf(".");
    let fileNameWithoutExtension = filename.substring(0, lastDotIndex);
    let fileExtension = filename.substring(lastDotIndex+1);
    let nameSuffix = '_zh_'+locale2;
    let newFileName = `${fileNameWithoutExtension}${nameSuffix}.${fileExtension}`;
    document.getElementById("download-filename").value = newFileName;
})

downloadButton.addEventListener("click", () => {
    let filename, text;
    if (!uploadFile.files[0]) {
        text = newTextArea.getValue();
        filename = document.getElementById("download-filename").value;
    } else {
        text = newTextArea.getValue();
        filename = uploadFile.files[0].name;
    }

    // Call the download function with the text and filename
    download(filename, text);
}, false);

convertTableButton.addEventListener("click", async () => {
    let xliff1 = oldTextArea.getValue();
    let xliff2 = newTextArea.getValue();

    makeTable(convertXliff(xliff1, xliff2));

    collapseExpandTagButton.style.visibility = "visible";

    let cells = document.querySelectorAll('td');
    let pattern = /(<ph[^>]*?>.*?<\/ph[^>]*?>|<bpt[^>]*?>.*?<\/bpt[^>]*?>|<ept[^>]*?>.*?<\/ept[^>]*?>)/gm;
    for (let cell of cells) {
        cell.textContent = cell.textContent.replace(pattern, '<span class="tag">$1</span><span class="ph" style="display:none;">⬣</span>');
        cell.innerHTML = cell.textContent;
    }
}, false);

markDiffButton.addEventListener("click", () => {
    markDiff();

    hideShowUnchangedButton.style.visibility = "visible";
}, false);

hideShowUnchangedButton.addEventListener("click", function() {
        let rows = document.querySelectorAll('tr');
        for (let row of rows) {
            if (row === rows[0]) continue;
            let cells = row.querySelectorAll('td');
            let hasDeleteOrInsertClass = false;
            for (let cell of cells) {
                let spans = cell.querySelectorAll('span');
                for (let span of spans) {
                    if (span.classList.contains('delete') || span.classList.contains('insert')) {
                        hasDeleteOrInsertClass = true;
                        break;
                    }
                }
            }
            if (!hasDeleteOrInsertClass) {
                if (row.style.display !== 'none') {
                    row.style.display = 'none';
                    hideShowUnchangedButton.value = '显示所有句段';
                } else {
                    row.style.display = '';
                    hideShowUnchangedButton.value = '隐藏未更改句段';
                }
            }
        }
});

collapseExpandTagButton.addEventListener("click", function() {
    const tagTds = document.querySelectorAll(".tag");

    // get all td elements with the "ph" class
    const phTds = document.querySelectorAll(".ph");

    // loop through each td element with the "tag" class
    for (const td of tagTds) {
        // if the td element is visible
        if (td.style.display !== "none") {
            // hide it
            td.style.display = "none";
        } else {
            // show it
            td.style.display = "";
        }
    }

    // loop through each td element with the "ph" class
    for (const td of phTds) {
        // if the td element is visible
        if (td.style.display == "none") {
            // hide it
            td.style.display = "";
        } else {
            // show it
            td.style.display = "none";
        }
    }
    if (collapseExpandTagButton.value == "折叠标签") {
        collapseExpandTagButton.value = "展开标签";
    } else {
        collapseExpandTagButton.value = "折叠标签";
    }
});

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.setValue(content, -1)
    }).catch(error => console.log(error));
}

function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    })
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function convertXliff(xliff1, xliff2) {
    let parser = new DOMParser();
    let xmlDoc1 = parser.parseFromString(xliff1, "text/xml");
    let xmlDoc2 = parser.parseFromString(xliff2, "text/xml");
    
    // Create an empty JSON object
    let json = {};

    // Select the <unit> or <trans-unit> elements from each XLIFF document
    let transUnits1 = xmlDoc1.querySelectorAll('unit, trans-unit');
    let transUnits2 = xmlDoc2.querySelectorAll('unit, trans-unit');

    for (let i = 0; i < transUnits1.length; i++) {
        let transUnit1 = transUnits1[i];
        let transUnit2 = transUnits2[i];
        let id = transUnit1.getAttribute("id");
        let source = transUnit1.getElementsByTagName("source")[0].innerHTML;
        let target1 = transUnit1.getElementsByTagName("target")[0].innerHTML;
        let target2 = transUnit2.getElementsByTagName("target")[0].innerHTML;
        json[id] = {
            number: i + 1,
            source: source,
            target1: target1,
            target2: target2
        };
    }
    return json;
}

function makeTable(json) {
    diffResultTable.querySelectorAll('tr').forEach(row => row.remove());

    // Create the table headers
    const headers = ["序号", "原文", "译文1", "译文2"];
    const headerRow = document.createElement('tr');
    diffResultTable.appendChild(headerRow);
    headers.forEach(header => {
        const cell = document.createElement('td');
        cell.innerText = header;
        headerRow.appendChild(cell);
    });
    
    Object.entries(json).forEach(([key, value]) => {
        const row = document.createElement('tr');
        diffResultTable.appendChild(row);
    
        // Loop through the values and create cells for each value
        Object.values(value).forEach(val => {
            const cell = document.createElement('td');
            cell.innerText = val;
            row.appendChild(cell);
        });
    });
}

function markDiff() {
    let dmp = new diff_match_patch();
    // Iterate over the rows in the table
    let rowNumber = diffResultTable.rows.length;
    for (let i = 1; i < rowNumber; i++) {
        // Get the third and fourth cells in the row
        let cell1 = diffResultTable.rows[i].cells[2];
        let cell2 = diffResultTable.rows[i].cells[3];

        // Compare the text in the cells using the diff-match-patch library
        let diffs = dmp.diff_main(cell1.innerText, cell2.innerText);

        // Iterate over the differences
        for (let j = 0; j < diffs.length; j++) {
            let diff = diffs[j];
            let operation = diff[0];
            let text = diff[1];

            // Check if the difference is a deletion or an insertion
            if (operation == -1) {
                // Mark the difference as red using the style attribute
                cell1.innerHTML = cell1.innerHTML.replace(text, "<span class='insert'>" + text + "</span>");
            } else if (operation == 1) {
                // Mark the difference as blue using the style attribute
                cell2.innerHTML = cell2.innerHTML.replace(text, "<span class='delete'>" + text + "</span>");
            }
        }
    }
}




// function parseXliff(content) {
//     const original = /<file [^>]*?original="([^"]+?)"/.exec(content)[1];
//     let parsedTransId = [];
//     let parsedSource = [];
//     let parsedTarget = [];
//     let parsedPercent = [];
//     const trimmedContent = content.replace(/<mq:historical-unit[^]+?<\/mq:historical-unit>/g, '').replace(/<alt-trans[^]+?<\/alt-trans>/g, '');
//     const regexTransUnit = new RegExp('<(trans-)?unit[^>]*? id="([^"]+?)"([^>]*?)>([^]+?)<\/(trans-)?unit>', 'g');
//     const regexPercent = new RegExp('(mq:percent|xmatch)="(\\d+)"');
//     const regexSource = new RegExp('<source[^>]*?>([^]*?)<\/source>');
//     const regexTarget = new RegExp('<target[^>]*?>([^]*?)<\/target>');
//     let match;
//     while (match = regexTransUnit.exec(trimmedContent)) {
//         let transId = match[1];
//         let matchPercent = regexPercent.exec(match[2]);
//         let sourceMatch = regexSource.exec(match[3]);
//         let targetMatch = regexTarget.exec(match[3]);
//         parsedTransId.push(transId);
//         parsedSource.push(sourceMatch ? sourceMatch[1] : '');
//         parsedTarget.push(targetMatch ? targetMatch[1] : '');
//         parsedPercent.push(matchPercent ? matchPercent[2] : 0);

//     }
//     return [original, parsedTransId, parsedSource, parsedTarget, parsedPercent];
// }

// function convertXMLEntities(string) {
//     return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// }

// function tagAndWordAsOneChar(string) {
//     let stringArray = [];
//     let match;
//     while (match = /(<ph[^>]*?>.*?<\/ph[^>]*?>|&lt;.*?&gt;)/g.exec(string)) {
//       stringArray.push(...string.substring(0, match.index).split(''));
//       stringArray.push(`<span class="tag" title="${match[0].startsWith('<ph')? convertXMLEntities(match[0]): match[0]}">⬣</span>`);
//       string = string.substring(match.index + match[0].length);
//     }
//     stringArray.push(...string.split(/((?<=[^A-Za-zÀ-ȕ])|(?=[^A-Za-zÀ-ȕ]))/g).filter(string => string.length >= 1));
//     return stringArray;
// }

// function tagToPlaceholder(string) {
//     return string.replace(/(<ph[^>]*?>.*?<\/ph[^>]*?>|&lt;.*?&gt;)/g, $0 => `<span class="tag" title="${$0.startsWith('<ph')? convertXMLEntities($0): $0}">⬣</span>`);
// }

