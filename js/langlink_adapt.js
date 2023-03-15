import * as OpenCC from './modules/opencc-js/full.js';
import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

(function () {

    const uploadFilename1 = document.getElementById('upload-filename1');
    const uploadFilename2 = document.getElementById('upload-filename2');
    const uploadFile1 = document.getElementById('upload-input1');
    const uploadFile2 = document.getElementById('upload-input2');
    // const downloadList = document.getElementById('download-list');
    const convertTableButton = document.getElementById('convert-table-button');
    const createLinkButton = document.getElementById('create-link-button')
    const hideShowUnchangedButton = document.getElementById('hide-show-unchanged');
    const collapseExpandTagButton = document.getElementById('collapse-expand-tag');
    const diffResultTable = document.getElementById('diff-result-table');

    // const origCN = document.getElementById('orig-type-cn');
    // const origHK = document.getElementById('orig-type-hk');
    // const origTW = document.getElementById('orig-type-tw');
    // const origTWP = document.getElementById('orig-type-twp');
    // const tarCN = document.getElementById('tar-type-cn');
    // const tarHK = document.getElementById('tar-type-hk');
    // const tarTW = document.getElementById('tar-type-tw');
    // const tarTWP = document.getElementById('tar-type-twp');

    const readFileContentWithLog1 = logPerformance(readFileContent1);
    const readFileContentWithLog2 = logPerformance(readFileContent2);
    const replaceHeadersWithLog = logPerformance(replaceHeaders);
    const setNewFileNameWithLog = logPerformance(setNewFileName);
    const setNewContentWithLog = logPerformance(setNewContent);
    const convertXliffWithLog = logPerformance(convertXliff);
    const makeTableWithLog = logPerformance(makeTable);
    const markDiffWithLog = logPerformance(markDiff);
    const markTagWithLog = logPerformance(markTag);
    const createDownloadLinkWithLog = logPerformance(createDownloadLink);

    let oldFiles1;
    let oldFiles2;
    let oldCounter1;
    let oldCounter2;
    let newCounter;
    let condition = false;
    let oldFilenames1 = [];
    let oldFilenames2 = [];
    let newFilenames = [];
    let oldFileContents1 = [];
    let oldFileContents2 = [];
    let newFileContents = [];

    uploadFilename1.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    uploadFilename1.addEventListener('drop', function (e) {
        e.preventDefault();
        oldFiles1 = e.dataTransfer.files;
        let totalSize = 0;

        oldFilenames1.length = 0;
        for (let file of oldFiles1) {
            oldFilenames1.push(file.name);
            totalSize += file.size;
        }
        uploadFilename1.innerHTML = Array.from(oldFilenames1).join('<br>');

        if (totalSize > 20*1024*1024) {
            convertTableButton.disabled = true;
            convertTableButton.title = '文件过大，无法转换成表格';
        } else {
            convertTableButton.disabled = false;
            convertTableButton.title = '';
        }

        oldFileContents1.length = 0;
        // readFileContent1();
        readFileContentWithLog1();

        hideShowUnchangedButton.style.visibility = 'hidden';
        collapseExpandTagButton.style.visibility = 'hidden';
    });

    uploadFile1.addEventListener('change', function (e) {
        oldFiles1 = e.target.files;
        let totalSize = 0;

        oldFilenames1.length = 0;
        for (let file of oldFiles1) {
            oldFilenames1.push(file.name);
            totalSize += file.size;
        }
        uploadFilename1.innerHTML = Array.from(oldFilenames1).join('<br>');

        if (totalSize > 20*1024*1024) {
            convertTableButton.disabled = true;
            convertTableButton.title = '文件过大，无法转换成表格';
        } else {
            convertTableButton.disabled = false;
            convertTableButton.title = '';
        }

        oldFileContents1.length = 0;
        // readFileContent1();
        readFileContentWithLog1();

        hideShowUnchangedButton.style.visibility = 'hidden';
        collapseExpandTagButton.style.visibility = 'hidden';
    });

    uploadFilename2.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    uploadFilename2.addEventListener('drop', function (e) {
        e.preventDefault();
        oldFiles2 = e.dataTransfer.files;
        let totalSize = 0;

        oldFilenames2.length = 0;
        for (let file of oldFiles2) {
            oldFilenames2.push(file.name);
            totalSize += file.size;
        }
        uploadFilename2.innerHTML = Array.from(oldFilenames2).join('<br>');

        oldFileContents2.length = 0;
        // readFileContent1();
        readFileContentWithLog2();
    });

    uploadFile2.addEventListener('change', function (e) {
        oldFiles2 = e.target.files;
        let totalSize = 0;

        oldFilenames2.length = 0;
        for (let file of oldFiles2) {
            oldFilenames2.push(file.name);
            totalSize += file.size;
        }
        uploadFilename2.innerHTML = Array.from(oldFilenames2).join('<br>');

        oldFileContents2.length = 0;
        // readFileContent1();
        readFileContentWithLog2();
    });

    convertTableButton.addEventListener('click', function (e) {
        let locale1, locale2;

        let result = getConvertOption();
        locale1 = result[0];
        locale2 = result[1];

        // replaceHeaders(oldFileContents1, oldFileContents2);
        replaceHeadersWithLog(...[oldFileContents1, oldFileContents2]);
        // setNewFileName(locale2);
        setNewFileNameWithLog(locale2);
        // setNewContent(locale1, locale2);
        setNewContentWithLog(...[locale1, locale2]);
        // makeTable(convertXliff(oldFileContents1, newFileContents), locale1, locale2);
        makeTableWithLog(...[convertXliffWithLog(...[oldFileContents1, newFileContents]), locale1, locale2]);
        // createDownloadLink(newFilenames, newFileContents);
        createDownloadLinkWithLog(...[newFilenames, newFileContents]);

        collapseExpandTagButton.style.visibility = 'visible';
        collapseExpandTagButton.value = '折叠标签';

        // markTag();
        markTagWithLog();

        condition = true;
        if (condition) {
            // markDiff();
            markDiffWithLog()
            hideShowUnchangedButton.style.visibility = 'visible';
            hideShowUnchangedButton.value = '隐藏未更改句段';
        }
        hideShowUnchangedContent();
        condition = false;
    });

    createLinkButton.addEventListener('click', function (e) {
        let locale1, locale2;

        let result = getConvertOption();
        locale1 = result[0];
        locale2 = result[1];

        // replaceHeaders(oldFileContents1, oldFileContents2);
        replaceHeadersWithLog(...[oldFileContents1, oldFileContents2]);
        // setNewFileName(locale2);
        setNewFileNameWithLog(locale2);
        // setNewContent(locale1, locale2);
        setNewContentWithLog(...[locale1, locale2]);
        // createDownloadLink(newFilenames, newFileContents);
        createDownloadLinkWithLog(...[newFilenames, newFileContents]);
    })

    hideShowUnchangedButton.addEventListener('click', function (e) {
        hideShowUnchangedContent();
    });

    collapseExpandTagButton.addEventListener('click', function (e) {
        hideShowTag();
    });

    // function readFileContent1() {
    //     if (oldFileContents1.length == 0) {
    //         oldCounter1 = oldFiles1.length;

    //         for (let i = 0; i < oldCounter1; i++) {
    //             let reader = new FileReader();
    //             reader.onload = function (e) {
    //                 oldFileContents1.push(reader.result);
    //             };
    //             reader.readAsText(oldFiles1[i]);
    //         }
    //         return oldFileContents1;
    //     } else {
    //         return oldFileContents1;
    //     }
    // }

    function readFileContent1() {
        if (oldFileContents1.length == 0) {
            oldCounter1 = oldFiles1.length;
            let fileReadPromises = [];
    
            for (let i = 0; i < oldCounter1; i++) {
                fileReadPromises.push(
                    $.Deferred(function (defer) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            defer.resolve(reader.result);
                        };
                        reader.readAsText(oldFiles1[i]);
                    }).promise()
                );
            }
            
            $.when.apply($, fileReadPromises).done(function () {
                let fileContents = Array.prototype.slice.call(arguments);
                oldFileContents1 = fileContents;
                return oldFileContents1;
            });
        } else {
            return oldFileContents1;
        }
    }

    function readFileContent2() {
        if (oldFileContents2.length == 0) {
            oldCounter2 = oldFiles2.length;
            let fileReadPromises = [];
    
            for (let i = 0; i < oldCounter2; i++) {
                fileReadPromises.push(
                    $.Deferred(function (defer) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            defer.resolve(reader.result);
                        };
                        reader.readAsText(oldFiles2[i]);
                    }).promise()
                );
            }
            
            $.when.apply($, fileReadPromises).done(function () {
                let fileContents = Array.prototype.slice.call(arguments);
                oldFileContents2 = fileContents;
                return oldFileContents2;
            });
        } else {
            return oldFileContents2;
        }
    }
    

    // function setNewFileName(locale2) {
    //     newFilenames.length = 0;

    //     for (let filename of oldFilenames1) {
    //         let lastDotIndex = filename.lastIndexOf('.');
    //         let fileNameWithoutExtension = filename.substring(0, lastDotIndex);
    //         let fileExtension = filename.substring(lastDotIndex + 1);
    //         let nameSuffix = '_zh_' + locale2;
    //         let newFileName = `${fileNameWithoutExtension}${nameSuffix}.${fileExtension}`;
    //         newFilenames.push(newFileName);
    //     }
    //     return newFilenames;
    // }

    function setNewFileName(locale2) {
        newFilenames.length = 0;
    
        $.each(oldFilenames1, function (index, filename) {
            let lastDotIndex = filename.lastIndexOf('.');
            let fileNameWithoutExtension = filename.substring(0, lastDotIndex);
            let fileExtension = filename.substring(lastDotIndex + 1);
            let nameSuffix = '_zh_' + locale2;
            let newFileName = `${fileNameWithoutExtension}${nameSuffix}.${fileExtension}`;
            newFilenames.push(newFileName);
        });
        return newFilenames;
    }

    function setNewContent(locale1, locale2) {
        let customDict = [
            ['“', '「'],
            ['”', '」'],
            ['‘', '『'],
            ['’', '』'],
          ];

        let converter = OpenCC.Converter({ from: locale1, to: locale2 });
        let customConverter = (locale2 === 'tw' || locale2 === 'twp') ? OpenCC.ConverterFactory([customDict]) : null;
        let langCode = (locale2 === 'cn') ? 'CN' : ((locale2 === 'hk') ? 'HK' : 'TW');

        let regex = /(?<=target-language\=\"zh\-)[a-zA-Z]{2}|(?<=trgLang\=\"zh\_)[a-zA-Z]{2}/gm;

        oldFileContents1.forEach((content, index) => {
            oldFileContents1[index] = content.replace(regex, langCode)
        });

        oldCounter1 = oldFiles1.length;
        newFileContents.length = 0;
        for (let i = 0; i < oldCounter1; i++) {
            let oldContent = oldFileContents1[i];
            newFileContents.push((customConverter) ? customConverter(converter(oldContent)) : converter(oldContent));
        }
        return newFileContents;
    }
    
    function getConvertOption() {
        let result = [];
        let locale1 = $('input[name="orig-type"]:checked').val();
        let locale2 = $('input[name="tar-type"]:checked').val();

        result.push(locale1);
        result.push(locale2);
        return result;
    }

    function convertXliff(oldXliff, newXliff) {
        let jsonArray = [];
        newCounter = newFileContents.length;

        for (let i = 0; i < newCounter; i++) {
            let parser = new DOMParser();
            let xmlDoc1 = parser.parseFromString(oldXliff[i], 'text/xml');
            let xmlDoc2 = parser.parseFromString(newXliff[i], 'text/xml');

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
                if (target1 && target2) {
                    json[id] = {
                        number: i + 1,
                        source: source,
                        target1: target1,
                        target2: target2
                    }
                };
            }
            jsonArray.push(json);
        }
        return jsonArray;
    }
    
    function makeTable(jsons, locale1, locale2) {
        diffResultTable.querySelectorAll('tr').forEach(row => row.remove());

        newCounter = newFilenames.length;

        for (let i = 0; i < newCounter; i++) {

            let fileHeader = document.createElement('tr');
            diffResultTable.append(fileHeader);
            let nameString = [`file${i + 1}`, `${oldFilenames1[i]}`];
            nameString.forEach(value => {
                let nameCell = document.createElement('th');
                nameCell.setAttribute('style', 'word-break: normal;');
                nameCell.innerText = value;
                fileHeader.appendChild(nameCell);
            })
            let emptyArray = ['', ''];
            emptyArray.forEach(value => {
                let emptyCell = document.createElement('th');
                emptyCell.innerText = value;
                emptyCell.setAttribute('style', 'display: none;');
                fileHeader.appendChild(emptyCell);
            })

            // Create the table headers
            let headers = ['序号', '原文', locale1, locale2];
            let headerRow = document.createElement('tr');
            diffResultTable.appendChild(headerRow);
            headers.forEach(header => {
                let cell = document.createElement('th');
                cell.innerText = header;
                headerRow.appendChild(cell);
            });


            Object.entries(jsons[i]).forEach(([key, value]) => {
                let row = document.createElement('tr');
                diffResultTable.appendChild(row);

                // Loop through the values and create cells for each value
                Object.values(value).forEach(val => {
                    let cell = document.createElement('td');
                    cell.innerText = val;
                    row.appendChild(cell);
                });
            });

        }
    }

    // function markTag() {
    //     let cells = document.querySelectorAll('td');
    //     let pattern = /(<ph[^>]*?>.*?<\/ph[^>]*?>|<bpt[^>]*?>.*?<\/bpt[^>]*?>|<ept[^>]*?>.*?<\/ept[^>]*?>)/gm;
    //     for (let cell of cells) {
    //         cell.textContent = cell.textContent.replace(pattern, '<span class="tag">$1</span><span class="ph" style="display:none;">⬣</span>');
    //         cell.innerHTML = cell.textContent;
    //     }
    // }
    
    function markTag() {
        let pattern = /(<ph[^>]*?>.*?<\/ph[^>]*?>|<bpt[^>]*?>.*?<\/bpt[^>]*?>|<ept[^>]*?>.*?<\/ept[^>]*?>)/gm;
        $('td').each(function() {
            let text = $(this).text().replace(pattern, '<span class="tag">$1</span><span class="ph" style="display:none;">⬣</span>');
            $(this).html(text);
        });
    }
    

    // function markDiff() {
    //     let dmp = new diff_match_patch();
    //     // Iterate over the rows in the table
    //     let rowNumber = diffResultTable.rows.length;
    //     for (let i = 2; i < rowNumber; i++) {
    //         let row = diffResultTable.rows[i];
    //         if (row.cells[1].innerText == '原文' || row.cells[2].innerText == '') {
    //             continue;
    //         } else {
    //             let diffs = dmp.diff_main(row.cells[2].innerHTML, row.cells[3].innerHTML);
    //             let html1 = dmp.diff_prettyHtml1(diffs);
    //             let html2 = dmp.diff_prettyHtml2(diffs);
    //             row.cells[2].innerHTML = html1;
    //             row.cells[3].innerHTML = html2;
    //         }
    //     }
    // }

    function markDiff() {
        let dmp = new diff_match_patch();
        $('#diff-result-table tr').each(function(){
            let row = $(this);
            if (row.find('td:eq(1)').text() == '原文' || row.find('td:eq(2)').text() == '') {
                return true;
            } else {
                let diffs = dmp.diff_main(row.find('td:eq(2)').html(), row.find('td:eq(3)').html());
                let html1 = dmp.diff_prettyHtml1(diffs);
                let html2 = dmp.diff_prettyHtml2(diffs);
                row.find('td:eq(2)').html(html1);
                row.find('td:eq(3)').html(html2);
            }
        });
    }

    // function hideShowUnchangedContent() {
    //     let rows = document.querySelectorAll('tr');
    //     for (let row of rows) {
    //         if (row.cells[1].innerText == '原文' || row.cells[2].innerHTML == '') continue;
    //         let cells = row.querySelectorAll('td');
    //         let hasDeleteOrInsertClass = false;
    //         for (let cell of cells) {
    //             let spans = cell.querySelectorAll('span');
    //             for (let span of spans) {
    //                 if (span.classList.contains('delete1') || span.classList.contains('insert2')) {
    //                     hasDeleteOrInsertClass = true;
    //                     break;
    //                 }
    //             }
    //         }
    //         if (!hasDeleteOrInsertClass) {
    //             if (row.style.display !== 'none') {
    //                 row.style.display = 'none';
    //                 hideShowUnchangedButton.value = '显示所有句段';
    //             } else {
    //                 row.style.display = '';
    //                 hideShowUnchangedButton.value = '隐藏未更改句段';
    //             }
    //         }
    //     }
    // }

    function hideShowUnchangedContent() {
        $("tr").each(function() {
            if ($(this).find("td:nth-child(1)").text() === "原文" || $(this).find("td:nth-child(2)").text() === "") return;
            if (!$(this).find("td span").hasClass("delete1") && !$(this).find("td span").hasClass("insert2")) {
                $(this).toggle();
            }
        });
        $("#hide-show-unchanged").val() === "隐藏未更改句段" ? $("#hide-show-unchanged").val("显示所有句段") : $("#hide-show-unchanged").val("隐藏未更改句段");
    }
    

    // function hideShowTag() {
    //     let tagTds = document.querySelectorAll('.tag');

    //     // get all td elements with the 'ph' class
    //     let phTds = document.querySelectorAll('.ph');

    //     // loop through each td element with the 'tag' class
    //     for (let td of tagTds) {
    //         // if the td element is visible
    //         if (td.style.display !== 'none') {
    //             // hide it
    //             td.style.display = 'none';
    //         } else {
    //             // show it
    //             td.style.display = '';
    //         }
    //     }

    //     // loop through each td element with the 'ph' class
    //     for (let td of phTds) {
    //         // if the td element is visible
    //         if (td.style.display == 'none') {
    //             // hide it
    //             td.style.display = '';
    //         } else {
    //             // show it
    //             td.style.display = 'none';
    //         }
    //     }
    //     if (collapseExpandTagButton.value == '折叠标签') {
    //         collapseExpandTagButton.value = '展开标签';
    //     } else {
    //         collapseExpandTagButton.value = '折叠标签';
    //     }
    // }

    function hideShowTag() {
        let $tagTds = $('.tag');
        let $phTds = $('.ph');
        $tagTds.toggle();
        $phTds.toggle();
        $("#collapse-expand-tag").val(function(i, v){
            return v === '折叠标签' ? '展开标签' : '折叠标签';
        });
    }
    

    // function createDownloadLink(filenames, contents) {
    //     downloadList.querySelectorAll('li').forEach(list => list.remove());
    //     newCounter = newFilenames.length;

    //     for (let i = 0; i < newCounter; i++) {
    //         let listIterm = document.createElement('li');
    //         let element = document.createElement('a');
    //         element.setAttribute('href', URL.createObjectURL(new Blob([contents[i]])));
    //         element.setAttribute('download', filenames[i]);
    //         element.text = filenames[i];

    //         listIterm.appendChild(element);
    //         downloadList.appendChild(listIterm);
    //     }
    // }

    function replaceHeaders(xliff1Arr, xliff2Arr) {
        let parser = new DOMParser();
      
        // iterate over the arrays of XLIFF files
        for (let i = 0; i < xliff1Arr.length; i++) {
          let xliff1 = xliff1Arr[i];
          let xliff2 = xliff2Arr[i];
      
          let file1Xml = parser.parseFromString(xliff1, 'text/xml');
          let file2Xml = parser.parseFromString(xliff2, 'text/xml');
      
          let file1Element = file1Xml.querySelector('file');
          let newId = file2Xml.querySelector('file').getAttribute('mq:id');
      
          console.log(`file1 id: ${file1Element.getAttribute('mq:id')}`);
          console.log(`file2 id: ${newId}`);
      
          file1Element.setAttribute('mq:id', newId);
          
          // serialize the modified XLIFF file and replace the original file in the array
          xliff1Arr[i] = new XMLSerializer().serializeToString(file1Xml);
        }
        return xliff1Arr;
      }

    function createDownloadLink(filenames, contents) {
        $('#download-list li').remove();
        newCounter = newFilenames.length;
        for (let i = 0; i < newCounter; i++) {
            $('<li>')
                .append($('<a>')
                    .attr({
                        href: URL.createObjectURL(new Blob([contents[i]])),
                        download: filenames[i]
                    })
                    .text(filenames[i]))
                .appendTo('#download-list');
        }
    }
    
    function logPerformance(fn) {
        return function() {
            let start = performance.now();
            let result = fn.apply(this, arguments);
            let end = performance.now();
            console.log(`${fn.name} took ${end - start} ms`);
            return result;
        }
    }
})();