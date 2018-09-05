const relativePath = (source, target) => {
  var sep = source.indexOf('/') !== -1 ? '/' : '\\';
  var targetArr = target.split(sep);
  var sourceArr = source.split(sep);
  var filename = targetArr.pop();
  var targetPath = targetArr.join(sep);
  var relativePath = '';

  while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
    sourceArr.pop();
    relativePath += '..' + sep;
  }

  var relPathArr = targetArr.slice(sourceArr.length);
  relPathArr.length && (relativePath += relPathArr.join(sep) + sep);

  return relativePath + filename;
};

export default relativePath;
