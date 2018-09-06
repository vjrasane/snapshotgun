import { replaceSlashes } from './utils';

const relativePath = (source, target) => {
  const separator = '/';

  const targetArr = replaceSlashes(target).split(separator);
  const sourceArr = replaceSlashes(source).split(separator);

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
