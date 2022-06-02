import GetNearSpot from '../models/GetNearSpot';
export default function root() {
  const root = {
    Query: {
      async spot(_: any, args: { address: string; version: string }) {
        return await GetNearSpot(args.address, args.version);
      },
    },
  };
  return root;
}
