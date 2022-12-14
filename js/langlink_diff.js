import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

(function () {

const uploadFilename1 = document.getElementById('upload-filename1');
const uploadFilename2 = document.getElementById('upload-filename2');
const uploadFile1 = document.getElementById('upload-input1');
const uploadFile2 = document.getElementById('upload-input2');
const convertTableButton = document.getElementById('convert-table-button');
const markDiffButton = document.getElementById('mark-diff-button');
const openNewTab = document.getElementById('open-new-tab');
const hideShowUnchangedButton = document.getElementById('hide-show-unchanged');
const collapseExpandTagButton = document.getElementById('collapse-expand-tag');
const hideShowTableTitle = document.getElementById('hide-show-title');
const diffResultTable = document.getElementById('diff-result-table');

let files1;
let files2;
let counter1;
let counter2;
let condition = false;
let filenames1 = [];
let filenames2 = [];
let fileContents1 = [];
let fileContents2 = [];

uploadFile1.addEventListener('change', function(e) {
    files1 = e.target.files;
    
    filenames1.length = 0;
    for (let file of files1) {
        filenames1.push(file.name);
    }
    uploadFilename1.innerHTML = Array.from(filenames1).join('<br>');

    fileContents1.length = 0;
    readFileContent1();
    
    hideShowUnchangedButton.style.visibility = 'hidden';
    collapseExpandTagButton.style.visibility = 'hidden';
    hideShowTableTitle.style.visibility = 'hidden';
})

uploadFile2.addEventListener('change', function(e) {
    files2 = e.target.files;
    
    filenames2.length = 0;
    for (let file of files2) {
        filenames2.push(file.name);
    }
    uploadFilename2.innerHTML = Array.from(filenames2).join('<br>');

    fileContents2.length = 0;
    readFileContent2();
    
    hideShowUnchangedButton.style.visibility = 'hidden';
    collapseExpandTagButton.style.visibility = 'hidden';
    hideShowTableTitle.style.visibility = 'hidden';
})

convertTableButton.addEventListener('click', async () => {
    makeTable(convertXliff(fileContents1, fileContents2));
    // createDownloadLink(filenames2, fileContents2);

    collapseExpandTagButton.style.visibility = 'visible';
    hideShowTableTitle.style.visibility = 'visible';
    hideShowUnchangedButton.value = '隐藏未更改句段';
    collapseExpandTagButton.value = '折叠标签';
    hideShowTableTitle.value = '隐藏表格标题';

    markTag();

    condition = true;

}, false);

markDiffButton.addEventListener('click', function(e) {
    if (condition) {
        markDiff();
        hideShowUnchangedButton.style.visibility = 'visible';
        collapseExpandTagButton.style.visibility = 'visible';
        hideShowTableTitle.style.visibility = 'visible';
    }

    condition = false;
}, false);

openNewTab.addEventListener('click', function(e) {
    openNewTab();
});

hideShowUnchangedButton.addEventListener('click', function (e) {
    let rows = document.querySelectorAll('tr');
    for (let row of rows) {
        if (row.cells[1].innerText == '原文' || row.cells[1].innerText == '') continue;
        let cells = row.querySelectorAll('td');
        let hasDeleteOrInsertClass = false;
        for (let cell of cells) {
            let spans = cell.querySelectorAll('span');
            for (let span of spans) {
                if (span.classList.contains('delete1') || span.classList.contains('insert2')) {
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

collapseExpandTagButton.addEventListener('click', function (e) {
    let tagTds = document.querySelectorAll('.tag');

    // get all td elements with the 'ph' class
    let phTds = document.querySelectorAll('.ph');

    // loop through each td element with the 'tag' class
    for (let td of tagTds) {
        // if the td element is visible
        if (td.style.display !== 'none') {
            // hide it
            td.style.display = 'none';
        } else {
            // show it
            td.style.display = '';
        }
    }

    // loop through each td element with the 'ph' class
    for (let td of phTds) {
        // if the td element is visible
        if (td.style.display == 'none') {
            // hide it
            td.style.display = '';
        } else {
            // show it
            td.style.display = 'none';
        }
    }
    if (collapseExpandTagButton.value == '折叠标签') {
        collapseExpandTagButton.value = '展开标签';
    } else {
        collapseExpandTagButton.value = '折叠标签';
    }
});

hideShowTableTitle.addEventListener('click', function(e) {
    hideTableTitle();
});

function readFileContent1() {
    if (fileContents1.length == 0) {
        counter1 = files1.length;

        for (let i = 0; i < counter1; i++) {
            let reader1 = new FileReader();
            reader1.onload = function(e) {
                fileContents1.push(reader1.result);
            };
            reader1.readAsText(files1[i]);
        }
        return fileContents1;
    }
}

function readFileContent2() {
    if (fileContents2.length == 0) {
        counter2 = files2.length;

        for (let i = 0; i < counter1; i++) {
            let reader2 = new FileReader();
            reader2.onload = function(e) {
                fileContents2.push(reader2.result);
            };
            reader2.readAsText(files2[i]);
        }
        return fileContents2;
    }
}

function convertXliff(xliff1, xliff2) {
    let jsonArray = [];
    counter2 = fileContents2.length;

    for (let i = 0; i < counter2; i++) {
        let parser = new DOMParser();
        let xmlDoc1 = parser.parseFromString(xliff1[i], 'text/xml');
        let xmlDoc2 = parser.parseFromString(xliff2[i], 'text/xml');
    
        // Create an empty JSON object
        let json = {};
    
        // Select the <unit> or <trans-unit> elements from each XLIFF document
        let transUnits1 = xmlDoc1.querySelectorAll('unit, trans-unit');
        let transUnits2 = xmlDoc2.querySelectorAll('unit, trans-unit');
    
        let unitNumber = transUnits1.length;
        for (let i = 0; i < unitNumber; i++) {
            let transUnit1 = transUnits1[i];
            let transUnit2 = transUnits2[i];
            let id = transUnit1.getAttribute('id');
            let source = transUnit1.getElementsByTagName('source')[0].innerHTML;
            let target1 = transUnit1.getElementsByTagName('target')[0].innerHTML;
            let target2 = transUnit2.getElementsByTagName('target')[0].innerHTML;
            json[id] = {
                number: i + 1,
                source: source,
                target1: target1,
                target2: target2
            };
        }
        jsonArray.push(json);
    }
    console.log(`jsonArray length: ${jsonArray.length}`)
    return jsonArray;
}

function makeTable(jsons) {
    diffResultTable.querySelectorAll('tr').forEach(row => row.remove());

    counter2 = filenames2.length;

    for (let i = 0; i < counter2; i++) {

    let fileHeader = document.createElement('tr');
    diffResultTable.append(fileHeader);
    let nameString = [`file${i+1}`,``,`${filenames1[i]}`,`${filenames2[i]}`];
    nameString.forEach(value => {
        let nameCell = document.createElement('td');
        nameCell.innerText = value;
        nameCell.setAttribute('style', 'word-break: normal;');
        nameCell.setAttribute('class', 'no-copy-text');
        fileHeader.appendChild(nameCell);
    })
    let emptyArray = ['', ''];
    emptyArray.forEach(value => {
        let emptyCell = document.createElement('td');
        emptyCell.innerText = value;
        emptyCell.setAttribute('style', 'display: none;');
        emptyCell.setAttribute('class', 'no-copy-text');
        fileHeader.appendChild(emptyCell);
    })

    // Create the table headers
    let headers = ['序号', '原文', '译文1', '译文2'];
    let headerRow = document.createElement('tr');
    diffResultTable.appendChild(headerRow);
    headers.forEach(header => {
        let cell = document.createElement('td');
        cell.innerText = header;
        cell.setAttribute('class', 'no-copy-text');
        headerRow.appendChild(cell);
    });

    Object.entries(jsons[i]).forEach(([key, value]) => {
        let row = document.createElement('tr');
        diffResultTable.appendChild(row);

        // Loop through the values and create cells for each value
        Object.values(value).forEach(val => {
            let cell = document.createElement('td');
            cell.innerText = val;
            cell.setAttribute('class', 'copy-text');
            row.appendChild(cell);
        });
    });

    }
}

function markTag() {
    let cells = document.querySelectorAll('td');
    let pattern = /(<ph[^>]*?>.*?<\/ph[^>]*?>|<bpt[^>]*?>.*?<\/bpt[^>]*?>|<ept[^>]*?>.*?<\/ept[^>]*?>)/gm;
    for (let cell of cells) {
        cell.textContent = cell.textContent.replace(pattern, '<span class="tag">$1</span><span class="ph" style="display:none;">⬣</span>');
        cell.innerHTML = cell.textContent;
    }
}

function markDiff() {
    let dmp = new diff_match_patch();
    // Iterate over the rows in the table
    let rowNumber = diffResultTable.rows.length;
    for (let i = 2; i < rowNumber; i++) {
        let row = diffResultTable.rows[i];
        if (row.cells[1].innerText == '原文' || row.cells[1].innerText == '') {
            continue;
        } else {
            let diffs = dmp.diff_main(row.cells[2].innerHTML, row.cells[3].innerHTML);
            let html1 = dmp.diff_prettyHtml1(diffs);
            let html2 = dmp.diff_prettyHtml2(diffs);
            row.cells[2].innerHTML = html1;
            row.cells[3].innerHTML = html2;
        }
    }
}

function hideTableTitle() {
    let rows = document.querySelectorAll('tr');
    for (let row of rows) {
        let cells = row.querySelectorAll('td');
        let hasNoCopyTextClass = false;
        for (let cell of cells) {
            if (cell.classList.contains('no-copy-text')) {
                hasNoCopyTextClass = true;
                break;
            }
        }
        if (hasNoCopyTextClass) {
            if (row.style.display !== 'none') {
                row.style.display = 'none';
                hideShowTableTitle.value = '显示表格标题';
            } else {
                row.style.display = '';
                hideShowTableTitle.value = '隐藏表格标题';
            }
        }
    }
}

function openNewTab() {
    let newPage = window.open();
    let counter = diffResultTable.rows.length;

    newPage.document.write('<table>');

    for (let i = 0; i <counter; i++){
        if (diffResultTable.rows[i].cell[0].classList.contains == 'no-copy-text') continue;
            newPage.document.write('<tr>');
            diffResultTable.rows[i].cells.forEach(cell => {
                newPage.document.write(`<td>${cell.innerHTML}</td>`);
            })
            newPage.document.write('</td>')
    }
    newPage.document.write('</table>');
}

})();