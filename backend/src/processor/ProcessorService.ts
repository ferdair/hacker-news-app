import { HNEntry } from '../models/HNEntry';

export type FilterType = 'more_than_5' | 'less_or_equal_to_5' | 'none';

export class ProcessorService {
  public countWords(title: string): number {
    const normalizedTitle = title.replace(/[\u00A0\u1680?\u180e\u2000-\u200a\u2028\u2029\u202f\u205f?\u3000\ufeff]/g, ' ');
    const tokens = normalizedTitle.split(/\s+/);
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
