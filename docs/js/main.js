import * as OpenCC from './modules/opencc-js/full.js';
import xliff from './modules/xliff/xliff.js';
import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

const uploadFile = document.getElementById("uploadFile");
const convertButton = document.getElementById("convert-button");
const downloadButton = document.getElementById("download-button");
const convertTableButton = document.getElementById("convert-table-button");
const markDiffButton = document.getElementById("mark-diff-button");
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
        writeFileNameAndSize()
        placeFileContent(oldTextArea, uploadFile.files[0])
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
})

downloadButton.addEventListener("click", () => {
    let filename, text;
    if (!uploadFile.files[0]) {
        text = newTextArea.getValue();
        filename = document.getElementById("fileName").value;
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

    // Parse the xliff file using the DOMParser
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xliff1, "text/xml");

    // Select the xliff tag
    let xliffTag = xmlDoc.querySelector('xliff');

    // Get the version attribute of the xliff tag
    let version = xliffTag.getAttribute('version');

    // Check the version and run code based on the result
    if (version === '1.2') {
        // Run code for xliff version 1.2
        let result = await xliff.xliff12ToJs(xliff1);
        // console.log(JSON.stringify(result));
    } else if (version === '2.0') {
        // Run code for xliff version 2.0
        let result = await xliff.xliff2js(xliff1);
        // console.log(JSON.stringify(result));
    } else {
        // Run code for other xliff versions
        let result = await xliff.xliff12ToJs(xliff1);
        // console.log(JSON.stringify(result));
    }

}, false);

markDiffButton.addEventListener("click", () => {
    markDiff();
}, false);

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

function writeFileNameAndSize() {
    let numberOfBytes = uploadFile.files[0].size;

    // Approximate to the closest prefixed unit
    const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const exponent = Math.min(
        Math.floor(Math.log(numberOfBytes) / Math.log(1024)), units.length - 1);
    const approx = numberOfBytes / 1024 ** exponent;

    // Format the output string
    const output = exponent === 0
        ? `${numberOfBytes} bytes`
        : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`
    
    // Set the values of the file size and file name input fields
    document.getElementById("fileSize").value = output;
    document.getElementById("fileName").value = uploadFile.files[0].name;
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
    for (var i = 1; i < diffResultTable.rows.length; i++) {
        // Get the third and fourth cells in the row
        var cell1 = diffResultTable.rows[i].cells[2];
        var cell2 = diffResultTable.rows[i].cells[3];

        // Compare the text in the cells using the diff-match-patch library
        var diffs = dmp.diff_main(cell1.innerText, cell2.innerText);

        // Iterate over the differences
        for (var j = 0; j < diffs.length; j++) {
            var diff = diffs[j];
            var operation = diff[0];
            var text = diff[1];

            // Check if the difference is a deletion or an insertion
            if (operation == -1) {
                // Mark the difference as red using the style attribute
                cell1.innerHTML = cell1.innerHTML.replace(text, "<span style='color: red;'>" + text + "</span>");
            } else if (operation == 1) {
                // Mark the difference as blue using the style attribute
                cell2.innerHTML = cell2.innerHTML.replace(text, "<span style='color: blue;'>" + text + "</span>");
            }
        }
    }
}

