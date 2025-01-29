import SwapiApi from '../apis/swapi/SwapiApi';
import SuperHeroApi from '../apis/superhero/SuperHeroApi';
import dynamoDBService from '../db/conn';
import { v4 as uuidv4 } from 'uuid';

const swapiApi = new SwapiApi();
const superHeroApi = new SuperHeroApi();

const DYNAMODB_TBL_CUSTOM_DATA = process.env.DYNAMODB_TBL_CUSTOM_DATA;
const DYNAMODB_TBL_HISTORY_APIS_FUSE = process.env.DYNAMODB_TBL_HISTORY_APIS_FUSE;
const APIKEY_SUPER_HERO = process.env.APIKEY_SUPER_HERO;

const CACHE_DURATION = 30 * 60;
const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDIS_URL);


export default class OperationService {

  async saveCustomData(data: any): Promise<any> {
    const params = {
      TableName: DYNAMODB_TBL_CUSTOM_DATA,
      Item: {
        id: uuidv4(),
        data: data
      }
    };
    return await dynamoDBService.putItem(params);
  }

  async getCustomData(): Promise<any> {
    const params = {
      TableName: DYNAMODB_TBL_CUSTOM_DATA,
      Limit: 20
    };
    return await dynamoDBService.scanItem(params);
  }

  async saveDataMerged(dataMerged: any): Promise<any> {
    const epochTimestamp = Math.floor(Date.now() / 1000);
    const params = {
      TableName: DYNAMODB_TBL_HISTORY_APIS_FUSE,
      Item: {
        id: uuidv4(),
        epochTimestamp: epochTimestamp,
        data: dataMerged,
      }
    }
    return await dynamoDBService.putItem(params);
  }

  async getCachedDataPeople(id: string): Promise<any> {
    const URL_SWAPI_PEOPLE = `https://swapi.py4e.com/api/people/${id}`;
    const cachedResult = await redisClient.get(URL_SWAPI_PEOPLE);
    if (cachedResult) {
      console.log(`Recuperado de la cache: Key => ${URL_SWAPI_PEOPLE}`);
      return JSON.parse(cachedResult);
    } else {
      const responseSwapiPeople = await swapiApi.callApiPeopleById(id);
      //const URL_SWAPI_PEOPLE = responseSwapiPeople['url'];
      const responseSwapiDataPeople = responseSwapiPeople['data'];
      console.log(`Guardado en la cache: Key => ${URL_SWAPI_PEOPLE}`);
      await redisClient.setex(URL_SWAPI_PEOPLE, CACHE_DURATION, JSON.stringify(responseSwapiDataPeople));
      return responseSwapiDataPeople;
    }
  }

  async getCachedDataSuperHeroSearchByName(name: string): Promise<any> {
    const URL_SUPERHERO_API_SEARCH = `https://www.superheroapi.com/api.php/${APIKEY_SUPER_HERO}/search/${name}`;
    const cachedResult = await redisClient.get(URL_SUPERHERO_API_SEARCH);
    if (cachedResult) {
      console.log(`Recuperado de la cache: Key => ${URL_SUPERHERO_API_SEARCH}`);
      return JSON.parse(cachedResult);
    } else {
      const responseSuperHero = await superHeroApi.callApiSearchByName(name);
      //const URL_SUPERHERO_API_SEARCH = responseSuperHero['url'];
      const responseSuperHeroData = responseSuperHero['data'];
      console.log(`Guardado en la cache: Key => ${URL_SUPERHERO_API_SEARCH}`);
      await redisClient.setex(URL_SUPERHERO_API_SEARCH, CACHE_DURATION, JSON.stringify(responseSuperHeroData));
      return responseSuperHeroData;
    }
  }

  async saveDataApisExternals(id: string): Promise<any> {
    const responseSwapiDataPeople = await this.getCachedDataPeople(id);

    const detail = responseSwapiDataPeople['detail'] || null;
    if (detail === "Not found"){
      const dataNotFound = {
        detail
      }
      await this.saveDataMerged(dataNotFound);
      return dataNotFound
    }
     
    const peopleName = responseSwapiDataPeople['name'];
    const peopleGender = responseSwapiDataPeople['gender'];
    const peopleHomeWorldUrl = responseSwapiDataPeople['homeworld'];
    
    const responseSuperHeroData = await this.getCachedDataSuperHeroSearchByName(peopleName);
   
  
    const superHeroResults = responseSuperHeroData['results'] || [];
    let biography = null;

    if (superHeroResults.length > 0) {
      biography = superHeroResults[0].biography;
    }

    const dataMerged = {
      people: {
        name: peopleName,
        gender: peopleGender,
        home: peopleHomeWorldUrl
      },
      superHero: {
        biography: biography || {},
      }
    };

    await this.saveDataMerged(dataMerged);
    return dataMerged
  }

  async getHistory(): Promise<any> {
    const params = {
      TableName: DYNAMODB_TBL_HISTORY_APIS_FUSE,
      Limit: 20
    };
    return await dynamoDBService.scanItem(params);
  }

  async paginateData(limit = 20): Promise<any> {
    const params = {
      TableName: DYNAMODB_TBL_HISTORY_APIS_FUSE,
      Limit: limit,
    };

    const items = await dynamoDBService.paginateQuery(params);
    return items;
  }
  
  paginate(items, page = 1, size = 10) {
    const count = items.length;
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    const paginatedItems = items.slice(startIndex, endIndex);
    const nextPage = endIndex < count ? page + 1 : null;

    return {
      page,
      size,
      count,
      next: nextPage,
      data: paginatedItems
    };
  }

}
