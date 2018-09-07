export const filterObj = (obj, filter) => {
  const filtered = {};
  Object.keys(obj)
    .filter(k => filter(k, obj[k]))
    .forEach(k => (filtered[k] = obj[k]));
  return filtered;
};

export const mapObj = (obj, mapper) => {
  const mapped = {};
  Object.keys(obj).forEach(k => {
    mapped[k] = mapper(k, obj[k]);
  });
  return mapped;
};

export const prependMissing = (str, pre) => {
  if (!str.startsWith(pre)) {
    return pre + str;
  }
  return str;
};

export const replaceSlashes = str => str.replace(/\\/g, '/');

export const toPath = str => prependMissing(replaceSlashes(str), './');

export const getFileName = file => file.replace(/\.[^/.]+$/, '');
