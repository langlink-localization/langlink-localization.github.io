import * as OpenCC from './modules/opencc-js/full.js';
import diff_match_patch from './modules/diff_match_patch/diff_match_patch.js';

$(function () {
    let oldFiles;
    let oldCounter;
    let newCounter;
    let condition = false;
    let oldFilenames = [];
    let newFilenames = [];
    let oldFileContents = [];
    let newFileContents = [];

    $('#upload-filename').on('.dragover', function (e) {
        e.preventDefault();
    });

    $('#upload-filename').on('.drop', function (e) {
        e.preventDefault();
        oldFiles = e.dataTransfer.files;

        oldFilenames.length = 0;
        for (let file of oldFiles) {
            oldFilenames.push(file.name);
        }
        $('#upload-filename').html(Array.from(oldFilenames).join('<br>'));

        oldFileContents.length = 0;
        readFileContent();

        $('#hide-show-unchanged').css('visibility', 'hidden');
        $('#collapse-expend-tag').css('visibility', 'hidden');
    });

    $('#upload-input').change(function (e) {
        oldFiles = e.target.files;

        oldFilenames.length = 0;
        for (let file of oldFiles) {
            oldFilenames.push(file.name);
        }
        $('#upload-filename').html(Array.from(oldFilenames).join('<br>'));

        oldFileContents.length = 0;
        readFileContent();

        $('#hide-show-unchanged').css('visibility', 'hidden');
        $('#collapse-expend-tag').css('visibility', 'hidden');
    });

    $('#convert-table-button').click(function (e) {
        let locale1, locale2;

        let result = getConvertOption();
        locale1 = result[0];
        locale2 = result[1];

        setNewFileName(locale2);
        setNewContent(locale1, locale2);
        makeTable(convertXliff(oldFileContents, newFileContents), locale1, locale2);
        createDownloadLink(newFilenames, newFileContents);

        $('#collapse-expend-tag').css('visibility', 'visible');
        $('#collapse-expend-tag').val('折叠标签');

        markTag();

        condition = true;
        if (condition) {
            markDiff();
            $('#hide-show-unchanged').css('visibility', 'visible');
            $('#hide-show-unchanged').val('隐藏未更改句段');
        }
        hideShowUnchangedContent();
        condition = false;

    });

    $('#create-link-button').click(function (e) {
        let locale1, locale2;

        let result = getConvertOption();
        locale1 = result[0];
        locale2 = result[1];

        setNewFileName(locale2);
        setNewContent(locale1, locale2);
        createDownloadLink(newFilenames, newFileContents);
    })

    $('#hide-show-unchanged').click(function (e) {
        hideShowUnchangedContent();
    });

    $('#collapse-expand-tag').click(function (e) {
        hideShowTag();
    });

    function readFileContent() {
        oldCounter = oldFiles.length;

        if (oldFileContents.length === 0) {
            $.each(oldFiles, function (index, file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    oldFileContents.push(reader.result);
                };
                reader.readAsText(file);
            });
            return oldFileContents;
        } else {
            return oldFileContents;
        }
    }


    function setNewFileName(locale2) {
        newFilenames.length = 0;

        oldFilenames.forEach(function (filename) {
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
        let converter = OpenCC.Converter({ from: locale1, to: locale2 });
        let regex = /(?<=target-language\=\"zh\-)[a-zA-Z]{2}|(?<=trgLang\=\"zh\_)[a-zA-Z]{2}/gm;

        let replacements = {
            cn: ['CN'],
            hk: ['HK'],
            tw: ['TW', '“', '”', '‘', '’', '「', '」', '『', '』'],
            twp: ['TW', '“', '”', '‘', '’', '「', '」', '『', '』']
        };

        oldFileContents.forEach((content, index) => {
            let replacementValues = replacements[locale2];
            oldFileContents[index] = content.replace(regex, replacementValues[0]);
            for (let i = 1; i < replacementValues.length; i += 2) {
                oldFileContents[index] = oldFileContents[index].replaceAll(replacementValues[i], replacementValues[i + 1]);
            }
        });

        newFileContents.length = 0;
        for (let i = 0; i < oldFileContents.length; i++) {
            let oldContent = oldFileContents[i];
            newFileContents.push(converter(oldContent));
        }
        return newFileContents;
    }

    function getConvertOption() {
        let locale1, locale2;
        let result = [];

        if ($('#orig-type-cn').prop('checked')) {
            locale1 = 'cn';
        } else if ($('#orig-type-hk').prop('checked')) {
            locale1 = 'hk';
        } else if ($('#orig-type-tw').prop('checked')) {
            locale1 = 'tw';
        } else if ($('#orig-type-twp').prop('checked')) {
            locale1 = 'twp';
        }

        if ($('#tar-type-CN').prop('checked')) {
            locale2 = 'cn';
        } else if ($('#tar-type-hk').prop('checked')) {
            locale2 = 'hk';
        } else if ($('#tar-type-tw').prop('checked')) {
            locale2 = 'tw';
        } else if ($('#tar-type-twp').prop('checked')) {
            locale2 = 'twp';
        }

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
            let transUnits1 = $(xmlDoc1).find('unit, trans-unit');
            let transUnits2 = $(xmlDoc2).find('unit, trans-unit');

            let unitNumber = transUnits1.length;
            for (let i = 0; i < unitNumber; i++) {
                let transUnit1 = transUnits1[i];
                let transUnit2 = transUnits2[i];
                let id = $(transUnit1).attr('id');
                let source = $(transUnit1).find('source').html();
                let target1 = $(transUnit1).find('target').html();
                let target2 = $(transUnit2).find('target').html();
                json[id] = {
                    number: i + 1,
                    source: source,
                    target1: target1,
                    target2: target2
                };
            }
            jsonArray.push(json);
        }
        return jsonArray;
    }

    function makeTable(jsons, locale1, locale2) {
        // remove all rows from the table
        $('#diff-result-table tr').remove();

        newCounter = newFilenames.length;

        for (let i = 0; i < newCounter; i++) {
            // create a row for the file name
            let fileHeader = $('<tr>');
            $('#diff-result-table').append(fileHeader);

            // create cells for the file name and append them to the row
            let nameString = ['file' + (i + 1), oldFilenames[i]];
            nameString.forEach(value => {
                let nameCell = $('<th>');
                nameCell.css('word-break', 'normal');
                nameCell.text(value);
                fileHeader.append(nameCell);
            });
            // create empty cells and append them to the row
            let emptyArray = ['', ''];
            emptyArray.forEach(value => {
                let emptyCell = $('<th>');
                emptyCell.text(value);
                emptyCell.css('display', 'none');
                fileHeader.append(emptyCell);
            });

            // create the table headers
            let headers = ['序号', '原文', locale1, locale2];
            let headerRow = $('<tr>');
            $('#diff-result-table').append(headerRow);
            headers.forEach(header => {
                let cell = $('<th>');
                cell.text(header);
                headerRow.append(cell);
            });

            // create rows for the JSON data and append them to the table
            Object.entries(jsons[i]).forEach(([key, value]) => {
                let row = $('<tr>');
                $('#diff-result-table').append(row);

                // create cells for the values and append them to the row
                Object.values(value).forEach(val => {
                    let cell = $('<td>');
                    cell.text(val);
                    row.append(cell);
                });
            });
        }
    }

    function markTag() {
        // select all td elements
        let cells = $('td');

        // create a regular expression to match tags
        let pattern = /(<ph[^>]*?>.*?<\/ph[^>]*?>|<bpt[^>]*?>.*?<\/bpt[^>]*?>|<ept[^>]*?>.*?<\/ept[^>]*?>)/gm;

        // iterate over the td elements
        cells.each(function () {
            // replace the tags with spans
            $(this).text($(this).text().replace(pattern, '<span class="tag">$1</span><span class="ph" style="display:none;">⬣</span>'));
            // set the innerHTML of the td element to the modified text content
            $(this).html($(this).text());
        });
    }

    function markDiff() {
        let dmp = new diff_match_patch();

        // Iterate over the rows in the table
        let rowNumber = $('#diff-result-table tr').length;
        for (let i = 2; i < rowNumber; i++) {
            let row = $('#diff-result-table tr:nth-child(' + i + ')');
            if (row.find('td:nth-child(2)').text() === '原文' || row.find('td:nth-child(3)').text() === '') {
                continue;
            } else {
                let diffs = dmp.diff_main(row.find('td:nth-child(3)').html(), row.find('td:nth-child(4)').html());
                let html1 = dmp.diff_prettyHtml1(diffs);
                let html2 = dmp.diff_prettyHtml2(diffs);
                row.find('td:nth-child(3)').html(html1);
                row.find('td:nth-child(4)').html(html2);
            }
        }
    }

    function hideShowUnchangedContent() {
        // select all tr elements
        let rows = $('tr');

        rows.each(function () {
            // skip rows where the second cell is "原文" or the third cell is empty
            if ($(this).find('td:nth-child(2)').text() === '原文' || $(this).find('td:nth-child(3)').text() === '') return;

            // select all td elements within the row
            let cells = $(this).find('td');
            let hasDeleteOrInsertClass = false;

            // check if any of the td elements contain a span with the 'delete1' or 'insert2' class
            cells.each(function () {
                let spans = $(this).find('span');
                spans.each(function () {
                    if ($(this).hasClass('delete1') || $(this).hasClass('insert2')) {
                        hasDeleteOrInsertClass = true;
                        return false; // exit the loop
                    }
                });
                if (hasDeleteOrInsertClass) return false; // exit the loop
            });

            // if no td elements contain a span with the 'delete1' or 'insert2' class, toggle the display of the row
            if (!hasDeleteOrInsertClass) {
                if ($(this).css('display') !== 'none') {
                    $(this).css('display', 'none');
                    $('#hide-show-unchanged').val('显示所有句段');
                } else {
                    $(this).css('display', '');
                    $('#hide-show-unchanged').val('隐藏未更改句段');
                }
            }
        });
    }

    function hideShowTag() {
        // select all td elements with the 'tag' class
        let tagTds = $('.tag');

        // select all td elements with the 'ph' class
        let phTds = $('.ph');

        // loop through each td element with the 'tag' class
        tagTds.each(function () {
            // if the td element is visible
            if ($(this).css('display') !== 'none') {
                // hide it
                $(this).css('display', 'none');
            } else {
                // show it
                $(this).css('display', '');
            }
        });

        // loop through each td element with the 'ph' class
        phTds.each(function () {
            // if the td element is visible
            if ($(this).css('display') === 'none') {
                // hide it
                $(this).css('display', '');
            } else {
                // show it
                $(this).css('display', 'none');
            }
        });

        // toggle the value of the element with the ID "collapse-expend-tag"
        $('#collapse-expend-tag').val(function (i, value) {
            return value === '折叠标签' ? '展开标签' : '折叠标签';
        });
    }

    function createDownloadLink(filenames, contents) {
        $('#download-list li').remove(); // remove all list items from the element with the ID "download-list"

        for (let i = 0; i < filenames.length; i++) {
            // create a list item and an anchor element
            let listItem = $('<li></li>');
            let element = $('<a></a>');

            // set the href and download attributes of the anchor element
            element.attr('href', URL.createObjectURL(new Blob([contents[i]])));
            element.attr('download', filenames[i]);

            // set the text of the anchor element to the filename
            element.text(filenames[i]);

            // append the anchor element to the list item, and the list item to the element with the ID "download-list"
            listItem.append(element);
            $('#download-list').append(listItem);
        }
    }
});