declare module 'fuse.js' {
  interface FuseOptions<T> {
    keys: (keyof T)[];
    threshold?: number;
    distance?: number;
    ignoreLocation?: boolean;
    minMatchCharLength?: number;
    isCaseSensitive?: boolean;
    findAllMatches?: boolean;
    includeScore?: boolean;
    includeMatches?: boolean;
  }

  class Fuse<T> {
    constructor(list: T[], options: FuseOptions<T>);
    search(query: string): { item: T }[];
  }

  export default Fuse;
}
