import * as cheerio from 'cheerio';
import axios from 'axios';

export default async function main() {
  const url = `https://zh.m.wikipedia.org/zh-tw/${encodeURI('臺北市行政區劃')}`;
  const res = await axios.get(url);
  const page = cheerio.load(res.data);
  const rez = page('html');
  console.log('');
}
main();
