import ch from '../utils/RabbitmqConn';
import { MongodbConn } from '../utils/MongodbConn';
import 'dotenv/config';
const area = ['松山區', '信義區', '大安區', '中山區', '中正區', '大同區', '萬華區', '文山區', '南港區', '內湖區', '士林區', '北投區'];

async function ProcessQueue() {
  const queue = 'UbikeV1Stream';
  const connection = await ch();
  const channel = await connection.createChannel();
  const mongo = new MongodbConn();
  await mongo.connect();
  await mongo.db.createCollection('ubikev1Avarage').catch((err) => {});
  const collection = mongo.db.collection('ubikev1Avarage');
  await collection.createIndex({ district: 'text' }, { unique: true }).catch((err) => {});
  await channel.prefetch(40);
  const dataArray: any[] = [];

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        let average: number[] = Array(area.length).fill(0);
        dataArray.push(data);
        dataArray.map((item) => {
          const subAverage = CalcSubAverage(SelectByArea(item), item);
          average = ArrayAdd(subAverage, average);
        });
        console.log(CalcAverage(average, dataArray.length));
        CalcAverage(average, dataArray.length).map((avg, index) => {
          const template = {
            district: area[index],
            avaliable_avg: avg,
            datatime: new Date().toLocaleString(),
          };
          collection.updateOne({ _id: index }, { $set: { _id: index, ...template } }, { upsert: true });
        });
        console.log(new Date().toLocaleString(), 'done');
        // console.log(data.createtime);
        channel.ack(msg);
        //console.log(dataArray[0][0]);
        if (dataArray.length > 17) {
          // channel.close();
          // connection.close();
          dataArray.shift();
        }
      } else {
        console.log('Consumer cancelled by server');
      }
    },
    { arguments: { 'x-stream-offset': '5m' } }
  );
}
function SelectByArea(stations: any[]) {
  const areaIndex: any[] = [];
  area.map((a) => {
    const indexs: any[] = [];
    stations.map((station, index) => {
      if (station.sarea === a) {
        indexs.push(index);
      }
    });
    areaIndex.push(indexs);
  });
  return areaIndex;
}
function CalcSubAverage(areaIndexs: any[], data: any[]) {
  //一個時間 、 所有站
  let calcRes: number[] = new Array(12).fill(0);
  areaIndexs.map((thisArea: number[]) => {
    thisArea.map((i: number) => {
      const district = data[i].sarea;
      calcRes[area.indexOf(district)] += parseInt(data[i].sbi);
    });
  });
  calcRes = calcRes.map((item, index) => {
    return item;
  });
  // console.log(calcRes);
  return calcRes;
}
function ArrayAdd(arr1: number[], arr2: number[]) {
  const res = new Array(arr1.length).fill(0);
  arr1.map((item, index) => {
    res[index] = item + arr2[index];
  });
  return res;
}
function CalcAverage(arr: number[], len: number) {
  return arr.map((item) => {
    return Math.ceil(item / len);
  });
}

ProcessQueue();
