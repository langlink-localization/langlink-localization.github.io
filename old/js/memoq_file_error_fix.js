(function () {
  const uploadFilename = document.getElementById("upload-filename");
  const uploadFile = document.getElementById("upload-input");
  const createLinkButton = document.getElementById("create-link-button");

  const readFileContentWithLog = logPerformance(readFileContent);
  const setNewFileNameWithLog = logPerformance(setNewFileName);
  const setNewContentWithLog = logPerformance(setNewContent);
  const createDownloadLinkWithLog = logPerformance(createDownloadLink);

  let oldFiles;
  let oldCounter;
  let newCounter;
  let oldFilenames = [];
  let newFilenames = [];
  let oldFileContents = [];
  let newFileContents = [];

  uploadFilename.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  uploadFilename.addEventListener("drop", function (e) {
    e.preventDefault();
    oldFiles = e.dataTransfer.files;
    let totalSize = 0;

    oldFilenames.length = 0;
    for (let file of oldFiles) {
      oldFilenames.push(file.name);
      totalSize += file.size;
    }
    uploadFilename.innerHTML = Array.from(oldFilenames).join("<br>");

    oldFileContents.length = 0;
    // readFileContent();
    readFileContentWithLog();
  });

  uploadFile.addEventListener("change", function (e) {
    oldFiles = e.target.files;
    let totalSize = 0;

    oldFilenames.length = 0;
    for (let file of oldFiles) {
      oldFilenames.push(file.name);
      totalSize += file.size;
    }
    uploadFilename.innerHTML = Array.from(oldFilenames).join("<br>");


    oldFileContents.length = 0;
    // readFileContent();
    readFileContentWithLog();
  });


  createLinkButton.addEventListener("click", function (e) {
    setNewFileNameWithLog();

    setNewContentWithLog();

    createDownloadLinkWithLog(...[newFilenames, newFileContents]);
  });

  function readFileContent() {
    if (oldFileContents.length == 0) {
      oldCounter = oldFiles.length;
      let fileReadPromises = [];

      for (let i = 0; i < oldCounter; i++) {
        fileReadPromises.push(
          $.Deferred(function (defer) {
            let reader = new FileReader();
            reader.onload = function (e) {
              defer.resolve(reader.result);
            };
            reader.readAsText(oldFiles[i]);
          }).promise()
        );
      }

      $.when.apply($, fileReadPromises).done(function () {
        let fileContents = Array.prototype.slice.call(arguments);
        oldFileContents = fileContents;
        return oldFileContents;
      });
    } else {
      return oldFileContents;
    }
  }

  function setNewFileName() {
    newFilenames.length = 0;

    $.each(oldFilenames, function (index, filename) {
      let lastDotIndex = filename.lastIndexOf(".");
      let fileNameWithoutExtension = filename.substring(0, lastDotIndex);
      let fileExtension = filename.substring(lastDotIndex + 1);
      let nameSuffix = "_fixed";
      let newFileName = `${fileNameWithoutExtension}${nameSuffix}.${fileExtension}`;
      newFilenames.push(newFileName);
    });
    return newFilenames;
  }

  function setNewContent() {
    let oldCounter = oldFiles.length;
    newFileContents.length = 0;

    for (let i = 0; i < oldCounter; i++) {
      let fileContent = oldFileContents[i];
      fileContent = fileContent
        .replace(/false"><source/g, 'false"/> <!-- <source')
        .replace(/<\/mq:insertedmatch>/g, '</mq:insertedmatch> -->');

      newFileContents.push(fileContent);
    }

    return newFileContents;
  }

  function createDownloadLink(filenames, contents) {
    $("#download-list li").remove();
    newCounter = newFilenames.length;
    for (let i = 0; i < newCounter; i++) {
      $("<li>")
        .append(
          $("<a>")
            .attr({
              href: URL.createObjectURL(new Blob([contents[i]])),
              download: filenames[i],
            })
            .text(filenames[i])
        )
        .appendTo("#download-list");
    }
  }

  function logPerformance(fn) {
    return function () {
      let start = performance.now();
      let result = fn.apply(this, arguments);
      let end = performance.now();
      console.log(`${fn.name} took ${end - start} ms`);
      return result;
    };
  }
})();
