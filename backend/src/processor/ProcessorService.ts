import { HNEntry } from '../models/HNEntry';

export type FilterType = 'more_than_5' | 'less_or_equal_to_5' | 'none';

export class ProcessorService {
  public countWords(title: string): number {
    const tokens = title.split(/\s+/);
    let count = 0;
    for (const token of tokens) {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanToken.length > 0) {
        count++;
      }
    }
    return count;
  }

  public process(entries: HNEntry[], filter: FilterType): HNEntry[] {
    if (filter === 'more_than_5') {
      const filtered = entries.filter(e => this.countWords(e.title) > 5);
      return filtered.sort((a, b) => b.comments - a.comments);
    } 
    if (filter === 'less_or_equal_to_5') {
      const filtered = entries.filter(e => this.countWords(e.title) <= 5);
      return filtered.sort((a, b) => b.points - a.points);
    }
    return entries;
  }
}
