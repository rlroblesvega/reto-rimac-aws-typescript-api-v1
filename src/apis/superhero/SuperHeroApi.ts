import axios from 'axios'

const APIKEY_SUPER_HERO = process.env.APIKEY_SUPER_HERO || 'APIKEY_SUPER_HERO';

export default class SuperHeroApi {

  async callApiSearchByName(name: string): Promise<any> {
    try {
      const URL_SUPERHERO_API_SEARCH = `https://www.superheroapi.com/api.php/${APIKEY_SUPER_HERO}/search/${name}`;
      const { data } = await axios.get(URL_SUPERHERO_API_SEARCH);
      return {
        url: URL_SUPERHERO_API_SEARCH,
        data: data
      };
    } catch (error) {
      if (error.response.status === 404) {
        return error.response.data;
      }
    }
  }
  
}
