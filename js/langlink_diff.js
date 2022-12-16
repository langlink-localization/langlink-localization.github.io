import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

(function () {

const uploadFilename1 = document.getElementById('upload-filename1');
const uploadFilename2 = document.getElementById('upload-filename2');
const uploadFile1 = document.getElementById('upload-input1');
const uploadFile2 = document.getElementById('upload-input2');
const upload1 = document.getElementById('upload1');
const upload2 = document.getElementById('upload2');
const hintText1 = document.getElementById('hint1');
const hintText2 = document.getElementById('hint2');
const convertTableButton = document.getElementById('convert-table-button');
const selectTableButton = document.getElementById('select-table');
const hideShowUnchangedButton = document.getElementById('hide-show-unchanged');
const collapseExpandTagButton = document.getElementById('collapse-expand-tag');
const hideShowTableTitleButton = document.getElementById('hide-show-title');
const diffResultTable = document.getElementById('diff-result-table');

let files1;
let files2;
let fileArray1 = new Array();
let fileArray2 = new Array();
let fileContents1 = [];
let fileContents2 = [];
let condition = false;
let diffVisibility;
let titleVisibility;

upload1.addEventListener('dragover', function(e) {
    e.preventDefault();
});

upload1.addEventListener('drop', async function(e) {
    e.preventDefault();

    files1 = e.dataTransfer.files;
    // let sortedFiles = Array.from(files1).sort((a, b) => a.name.localeCompare(b.name));
    hintText1.style.display = 'none';

    fileArray1.length = 0;
    setFileArray(files1, fileArray1, uploadFilename1).then(() => {
        for (let file of fileArray1) {
            fileContents1.push(file[1]);
        }
        hideShowUnchangedButton.style.visibility = 'hidden';
        collapseExpandTagButton.style.visibility = 'hidden';
        hideShowTableTitleButton.style.visibility = 'hidden';
    });
});

upload2.addEventListener('dragover', function(e) {
    e.preventDefault();
});

upload2.addEventListener('drop', async function(e) {
    e.preventDefault();
    files2 = e.dataTransfer.files;
    // let sortedFiles = Array.from(files2).sort((a, b) => a.name.localeCompare(b.name));
    hintText2.style.display = 'none';

    fileArray2.length = 0;
    setFileArray(files2, fileArray2, uploadFilename2).then(() => {
        for (let file of fileArray2) {
            fileContents2.push(file[1]);
        }
    });
});

uploadFile1.addEventListener('change', async function(e) {
    files1 = e.target.files;
    // let sortedFiles = Array.from(files1).sort((a, b) => a.name.localeCompare(b.name));
    hintText1.style.display = 'none'
    
    fileArray1.length = 0;
    setFileArray(files1, fileArray1, uploadFilename1).then(() => {
        for (let file of fileArray1) {
            fileContents1.push(file[1]);
        }
        hideShowUnchangedButton.style.visibility = 'hidden';
        collapseExpandTagButton.style.visibility = 'hidden';
        hideShowTableTitleButton.style.visibility = 'hidden';
    });
});

uploadFile2.addEventListener('change', async function(e) {
    files2 = e.target.files;
    // let sortedFiles = Array.from(files2).sort((a, b) => a.name.localeCompare(b.name));
    hintText2.style.display = 'none';

    fileArray2.length = 0;
    setFileArray(files2, fileArray2, uploadFilename2).then(() => {
        for (let file of fileArray2) {
            fileContents2.push(file[1]);
        }
    });
});

convertTableButton.addEventListener('click', function(e) {
    // arrangeFileList();
    makeTable(convertXliff(fileContents1, fileContents2));

    collapseExpandTagButton.style.visibility = 'visible';
    hideShowTableTitleButton.style.visibility = 'visible';
    collapseExpandTagButton.value = '折叠标签';
    hideShowTableTitleButton.value = '隐藏表格标题';

    markTag();

    condition = true;
    if (condition) {
        markDiff();
        hideShowUnchangedButton.style.visibility = 'visible';
        hideShowUnchangedButton.value = '隐藏未更改句段';
    }
    hideShowUnchangedContent();
    condition = false;

});

selectTableButton.addEventListener('click', function(e) {
    selectTableContent();
});

hideShowUnchangedButton.addEventListener('click', function (e) {
    hideShowUnchangedContent();
});

collapseExpandTagButton.addEventListener('click', function (e) {
    hideShowTag();
});

hideShowTableTitleButton.addEventListener('click', function(e) {
    hideShowTableTitle();
});

async function setFileArray(files, fileArray, uploadFilename) {
    uploadFilename.innerHTML = '';
    for (let file of files) {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
  
      let fileContent = await new Promise((resolve, reject) => {
        fileReader.onloadend = (e) => resolve(e.target.result);
        fileReader.onerror = reject;
      });
  
      fileArray.push([file.name, fileContent]);
      console.log(`file name: ${file.name}, size: ${file.size}`);
      uploadFilename.innerHTML += file.name + '<br>';
    }
    return Promise.resolve();
}

function convertXliff(xliff1, xliff2) {
    let jsonArray = [];
    let counter = xliff1.length;

    for (let i = 0; i < counter; i++) {
        let parser = new DOMParser();
        let xmlDoc1 = parser.parseFromString(xliff1[i], 'text/xml');
        let xmlDoc2 = parser.parseFromString(xliff2[i], 'text/xml');
    
        // Create an empty JSON object
        let json = {};

        let file = xmlDoc1.querySelector('file');
    
        // Select the <unit> or <trans-unit> elements from each XLIFF document
        let transUnits1 = xmlDoc1.querySelectorAll('unit, trans-unit');
        let transUnits2 = xmlDoc2.querySelectorAll('unit, trans-unit');
    
        let unitNumber = transUnits1.length;
        for (let j = 0; j < unitNumber; j++) {
            let transUnit1 = transUnits1[j];
            let transUnit2 = transUnits2[j];
            let id1 = transUnit1.getAttribute('id');
            let id2 = transUnit2.getAttribute('id');            
            if (id1 == id2) {
                let source1 = transUnit1.getElementsByTagName('source')[0].innerHTML;
                let target1 = transUnit1.getElementsByTagName('target')[0].innerHTML;
                let target2 = transUnit2.getElementsByTagName('target')[0].innerHTML;

                json[id1] = {
                    number: j + 1,
                    source: source1,
                    target1: target1,
                    target2: target2
                };
            } else {
                console.log(`第${i}个文件：id1: ${id1}, id2: ${id2}`);
                break;
            }
            
        }
        jsonArray.push(json);
    }
    return jsonArray;
}

function makeTable(jsons) {
    diffResultTable.querySelectorAll('tr').forEach(row => row.remove());

    let counter = fileArray2.length;

    for (let i = 0; i < counter; i++) {
        let fileHeader = document.createElement('tr');
        diffResultTable.append(fileHeader);
        let nameString = [`file${i+1}`,``,`${fileArray1[i][0]}`,`${fileArray2[i][0]}`];
        nameString.forEach(value => {
            let nameCell = document.createElement('th');
            nameCell.innerText = value;
            nameCell.style.display = 'word-break: normal';
            nameCell.classList.add('no-copy-text');
            fileHeader.appendChild(nameCell);
        })

        // Create the table headers
        let headers = ['序号', '原文', '译文1', '译文2'];
        let headerRow = document.createElement('tr');
        diffResultTable.appendChild(headerRow);
        headers.forEach(header => {
            let cell = document.createElement('th');
            cell.innerText = header;
            cell.classList.add('no-copy-text');
            headerRow.appendChild(cell);
        });

        Object.entries(jsons[i]).forEach(([key, value]) => {
            let row = document.createElement('tr');
            diffResultTable.appendChild(row);

            // Loop through the values and create cells for each value
            Object.values(value).forEach(val => {
                let cell = document.createElement('td');
                cell.innerText = val;
                cell.classList.add('copy-text');
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

function hideShowUnchangedContent() {
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
                diffVisibility = 'hide';
            } else {
                row.style.display = '';
                hideShowUnchangedButton.value = '隐藏未更改句段';
                diffVisibility = 'show';
            }
        }
    }
}

function hideShowTag() {
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
}

function hideShowTableTitle() {
    let cells = document.querySelectorAll('th');
    let headHidden = true;

    for (let cell of cells) {
        if (headHidden) {
            if (cell.style.display !== 'none') {
                cell.style.display = 'none';
                hideShowTableTitleButton.value = '显示表格标题';
                titleVisibility = 'hide';
            } else {
                cell.style.display = '';
                hideShowTableTitleButton.value = '隐藏表格标题';
                titleVisibility = 'show';
            }
        }
    }
    headHidden = !headHidden;
}

function selectTableContent() {
    hideShowTableTitle();

    if (diffVisibility == 'show') {
        hideShowUnchangedContent();
    }  
    if (titleVisibility == 'show') {
        hideShowTableTitle();
    }

    let range = document.createRange();
    range.selectNodeContents(diffResultTable);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

})();