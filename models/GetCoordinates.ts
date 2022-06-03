import axios from 'axios';

export default async function GetCoordinates(address: string) {
  let data = await (await axios.get(`https://www.google.com/maps/place?q=${encodeURI(address)}`)).data;
  data = data.toString();
  let pos = data.indexOf('center') + 7;
  data = data.slice(pos, pos + 50);
  const lat = data.slice(0, data.indexOf('%2C'));
  const lng = data.slice(data.indexOf('%2C') + 3, data.indexOf('&amp'));
  return [parseFloat(lng), parseFloat(lat)];
}
