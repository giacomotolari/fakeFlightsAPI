import geoCoder from "node-open-geocoder";
import { getDistance } from "geolib";

export let airports = [
  {
    name: "London",
    country: "UK",
  },
  {
    name: "Paris",
    country: "France",
  },
  {
    name: "Warsaw",
    country: "Poland",
  },
  {
    name: "Prague",
    country: "Czech Republic",
  },
  {
    name: "Hamburg",
    country: "Germany",
  },
  {
    name: "Budapest",
    country: "Hungary",
  },
  {
    name: "Stuttgart",
    country: "Germany",
  },
];

const getFLightPrice = (flightDurationInHours) => {
  const normalPrice =
    15 + Math.floor(Math.random() * (flightDurationInHours * 120));
  return (normalPrice / 100) * normalPrice;
};

// get distance between two addresses / geo points in meters
const getGeoData = (strLocation1, strLocation2) => {
  return new Promise((resolve, reject) => {
    geoCoder()
      .geocode(strLocation1)
      .end((err, res) => {
        const coordAirport1 = { latitude: res[0].lat, longitude: res[0].lon };
        geoCoder()
          .geocode(strLocation2)
          .end((err, res) => {
            const coordAirport2 = {
              latitude: res[0].lat,
              longitude: res[0].lon,
            };
            const dist = getDistance(coordAirport1, coordAirport2);
            resolve(dist);
          });
      });
  });
};

const getFlightsAPI = async () => {
  let flights = [];

  for (let i = 0; i < airports.length; i++) {
    // combine with every other airport
    for (let j = i + 1; j < airports.length; j++) {
      const distance = Math.round(
        (await getGeoData(
          `${airports[i].name} Airport, ${airports[i].country}`,
          `${airports[j].name} Airport, ${airports[j].country}`
        )) / 1000
      );

      const landingAndBoardingTime = 0.5;
      const averageFlightSpeed = 800;
      const flightDurationInHours =
        distance / averageFlightSpeed + landingAndBoardingTime;

      // HOW MANY DAYS OF FLIGHTS
      const amountFlights = 30;

      //ITERATION X DAYS TO ADD 1 DAY EVRY TIME

      for (let x = 0; x < amountFlights; x++) {
        //first flight

        flights.push({
          from: airports[i].name,
          to: airports[j].name,
          countryFrom: airports[i].country,
          countryTo: airports[j].country,
          distance: `${distance} km`,
          price: getFLightPrice(flightDurationInHours),
          flightDurationInHours,
          price: getFLightPrice(flightDurationInHours),
        });

        //second flight

        flights.push({
          from: airports[j].name,
          to: airports[i].name,
          countryFrom: airports[j].country,
          countryTo: airports[i].country,
          distance: `${distance} km`,
          flightDurationInHours,
          price: getFLightPrice(flightDurationInHours),
        });
      }
    }
  }
  return flights;
};

const flightsDb = await getFlightsAPI();

console.log(flightsDb);
