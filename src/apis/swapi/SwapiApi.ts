import axios from 'axios'

export default class SwapiApi {

  async callApiPeopleById(id: string): Promise<any> {
    try {
      const URL_SWAPI_PEOPLE = `https://swapi.py4e.com/api/people/${id}`;
      const { data } = await axios.get(URL_SWAPI_PEOPLE);
      return {
        url: URL_SWAPI_PEOPLE,
        data: data
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      return {
        data: error?.response?.data
      }
    }
  }

  async callApiPlanetByUrl(url: string): Promise<any> {
    try {
      const URL_SWAPI_PLANET = url;
      const { data } = await axios.get(URL_SWAPI_PLANET);
      return {
        url: URL_SWAPI_PLANET,
        data: data
      };
    } catch (error) {
      console.error(`Error: ${error}`);
      return {
        data: error?.response?.data
      }
    }
  }
  
}
