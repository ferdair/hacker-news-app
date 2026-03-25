import { ProcessorService } from './ProcessorService';
import { HNEntry } from '../models/HNEntry';

describe('ProcessorService', () => {
  let processor: ProcessorService;

  beforeEach(() => {
    processor = new ProcessorService();
  });

  describe('countWords', () => {
    it('counts only spaced words and excludes symbols', () => {
      const result = processor.countWords('This is - a self-explained example');
      expect(result).toBe(5); // This, is, a, selfexplained, example
    });

    it('counts words with punctuation correctly', () => {
      expect(processor.countWords('Hello, world!')).toBe(2);
      expect(processor.countWords('123 and 456...')).toBe(3);
    });

    it('correctly counts words in long title with special apostrophes and potentially non-breaking spaces', () => {
      const title = 'In Edison’s Revenge, Data Centers Are Transitioning From AC to DC';
      expect(processor.countWords(title)).toBe(11);
    });
  });

  describe('process', () => {
    const mockEntries: HNEntry[] = [
      { rank: 1, title: 'A short title', points: 100, comments: 20 }, // 3 words
      { rank: 2, title: 'This is a longer title with more than five words', points: 50, comments: 100 }, // 10 words
      { rank: 3, title: 'Another short one', points: 200, comments: 10 }, // 3 words
      { rank: 4, title: 'Here is another very long title indeed', points: 10, comments: 50 }, // 7 words
    ];

    it('filters > 5 words and sorts by comments descending', () => {
      const result = processor.process(mockEntries, 'more_than_5');
      expect(result.length).toBe(2);
      expect(result[0].comments).toBe(100);
      expect(result[1].comments).toBe(50);
    });

    it('filters <= 5 words and sorts by points descending', () => {
      const result = processor.process(mockEntries, 'less_or_equal_to_5');
      expect(result.length).toBe(2);
      expect(result[0].points).toBe(200);
      expect(result[1].points).toBe(100);
    });

    it('returns all entries when filter is none', () => {
      const result = processor.process(mockEntries, 'none');
      expect(result.length).toBe(4);
    });
  });
});
