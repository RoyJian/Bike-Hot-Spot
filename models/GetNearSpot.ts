import GetCoordinates from './GetCoordinates';
import { MongodbConn } from '../utils/MongodbConn';

export default async function GetNearSpot(address: string, ver: string) {
  const coordinates = await GetCoordinates(address);
  console.log(new Date().toLocaleString(), address, coordinates);
  const mongo = new MongodbConn();
  await mongo.connect();
  await mongo.db.createCollection(ver).catch((err) => {});
  const collection = mongo.db.collection(ver);

  const query = {
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: 800,
      },
    },
  };
  const res = await collection.find(query).toArray();
  await mongo.client.close();
  return res;
}
// GetNearSpot('台北101', 'ubikev1');
