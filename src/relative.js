const relativePath = (source, target) => {
  const separator = source.includes('/') ? '/' : '\\';

  const targetArr = target.split(separator);
  const sourceArr = source.split(separator);

  const filename = targetArr.pop();
  const targetPath = targetArr.join(separator);
  let relativePath = [];

  while (!targetPath.includes(sourceArr.join(separator))) {
    sourceArr.pop();
    relativePath.push('..');
  }

  const relArray = targetArr.slice(sourceArr.length);
  if (relArray.length) {
    relativePath = [...relativePath, ...relArray];
  }

  relativePath.push(filename);
  return relativePath.join(separator);
};

export default relativePath;
