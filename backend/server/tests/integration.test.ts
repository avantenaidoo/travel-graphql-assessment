import request from 'supertest';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../src/graphql/schema';
import { resolvers } from '../src/graphql/resolvers';

let app: express.Application;
let server: ApolloServer;

beforeAll(async () => {
  app = express();
  server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
});

const gql = (query: string, variables = {}) =>
  request(app).post('/graphql').send({ query, variables });

describe('GraphQL API', () => {
  it('citySuggestions', async () => {
    const res = await gql(`query { citySuggestions(name: "Cape") { name lat } }`);
    expect(res.body.data.citySuggestions.length).toBeGreaterThan(0);
  });

  it('weatherForecast', async () => {
    const res = await gql(`query { weatherForecast(lat: -33.92, lng: 18.42, days: 1) { daily { tempMax } } }`);
    expect(res.body.data.weatherForecast.daily).toHaveLength(1);
  });

  it('rankedActivities', async () => {
    const res = await gql(`query { rankedActivities(lat: -33.92, lng: 18.42, days: 1) { name rank } }`);
    expect(res.body.data.rankedActivities).toHaveLength(4);
    expect(res.body.data.rankedActivities[0].rank).toBe(1);
  });
});