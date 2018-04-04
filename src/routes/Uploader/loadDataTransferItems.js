export default function loadDataTransferItems (dataTransferItems) {

  function processItem (item) {

    // If top-level item is a file, there is no need to create a directory reader
    if (item.isFile)
      return new Promise(resolveFile => item.file(resolveFile));

    let reader = item.createReader();

    // Resolved when the entire directory is traversed
    return new Promise(resolveDirectory => {

      var iterationAttempts = [];

      (function readEntries () {

        // According to the FileSystem API spec, readEntries() must be called until
        // it calls the callback with an empty array. Seriously??

        reader.readEntries(entries => {

          // Done iterating this particular directory
          if (!entries.length)
            return resolveDirectory(Promise.all(iterationAttempts));

          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iterationAttempts.push(Promise.all(entries.map(entry => {

            return entry.isFile
              ? new Promise(resolveFile => entry.file(resolveFile))
              : processItem(entry);

          })));

          // Try calling readEntries() again for the same dir, according to spec
          readEntries();

        });

      })();
    });

  }

  let topLevelPromises = [];

  for (let i = 0; i < dataTransferItems.length; i++) {

    let entry = dataTransferItems[i].webkitGetAsEntry();
    if (entry) topLevelPromises.push(processItem(entry));

  }

  return Promise.all(topLevelPromises).then(function (files) {
    return Promise.resolve(_.flattenDeep(files));
  });

}
