import { Duffel } from '@duffel/api';

const duffel = new Duffel({
  token: process.env.DUFFEL_API_TOKEN,
  // sandbox is automatically used when token starts with duffel_test_
});

export default duffel;
