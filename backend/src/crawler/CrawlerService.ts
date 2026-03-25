import axios from 'axios';
import * as cheerio from 'cheerio';
import { HNEntry } from '../models/HNEntry';

export class CrawlerService {
  private readonly URL = 'https://news.ycombinator.com/';

  public async fetchEntries(limit: number = 30): Promise<HNEntry[]> {
    const response = await axios.get(this.URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const entries: HNEntry[] = [];

    const rows = $('tr.athing').slice(0, limit);

    rows.each((i, el) => {
      const rankStr = $(el).find('.rank').text().replace('.', '').trim();
      const title = $(el).find('.titleline > a').text().trim();
      
      const subtextRow = $(el).next();
      
      const pointsStr = subtextRow.find('.score').text().replace(' points', '').trim();
      
      const commentsText = subtextRow.find('a').last().text().trim();
      let comments = 0;
      if (commentsText.includes('comment')) {
        comments = parseInt(commentsText.replace(/[^0-9]/g, '')) || 0;
      }

      entries.push({
        rank: parseInt(rankStr) || 0,
        title,
        points: parseInt(pointsStr) || 0,
        comments
      });
    });

    return entries;
  }
}
