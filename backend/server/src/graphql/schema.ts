// src/graphql/schema.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    citySuggestions(name: String!): [City!]!
    weatherForecast(lat: Float!, lng: Float!, days: Int = 7): WeatherForecast!
    rankedActivities(lat: Float!, lng: Float!, days: Int = 7): [Activity!]!
  }

  type City {
    id: ID!
    name: String!
    country: String!
    admin1: String
    lat: Float!
    lng: Float!
  }

  type DailyWeather {
    date: String!
    tempMax: Float!
    tempMin: Float!
    precipitationSum: Float!
    windSpeedMax: Float!
    snowfallSum: Float!
  }

  type WeatherForecast {
    daily: [DailyWeather!]!
  }

  type Activity {
    name: ActivityName!
    rank: Int!
    suitabilityScore: Float!
  }

  enum ActivityName {
    SKIING
    SURFING
    INDOOR_SIGHTSEEING
    OUTDOOR_SIGHTSEEING
  }
`;