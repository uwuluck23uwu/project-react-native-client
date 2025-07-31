import Fuse from 'fuse.js';

const searchWithFuse = (data: any[], searchText: string, keys: string[], threshold = 0.3) => {
  const options = { keys, threshold };
  const fuse = new Fuse(data, options);

  if (!searchText) return data;
  return fuse.search(searchText).map((result) => result.item);
};

export default searchWithFuse;