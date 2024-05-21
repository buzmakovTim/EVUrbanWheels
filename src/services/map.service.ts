import { Injectable } from "@angular/core";
import axios from "axios";

const API_KEY = 'AIzaSyBJVArchQ56_LnWisDfTGptvzlSbKB9Xts';


export type RouteType = {
  origin: {
    lat: number,
    lng: number
  },
  destination: {
    lat: number,
    lng: number
  }
}

const VANCOUVER_LOCATION = {
  lat: 49.2827291,
  lng: -123.1207375
}
@Injectable({
  providedIn: 'root'
})

export class MapService {

  async getDistance(route: RouteType): Promise<any> {
    const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${route.origin.lat},${route.origin.lng}&destinations=${route.destination.lat},${route.destination.lng}&key=${API_KEY}`
    try {
      const data = await axios.get(URL);
      return data;
    } catch (error) {
      throw error
    }
  }

  async getGetRadiusFromPickUp(route: RouteType): Promise<any> {
    const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${route.origin.lat},${route.origin.lng}&destinations=${VANCOUVER_LOCATION.lat},${VANCOUVER_LOCATION.lng}&key=${API_KEY}`
    try {
      const data = await axios.get(URL);
      return data;
    } catch (error) {
      throw error
    }
  }

  async getGetRadiusFromDropOff(route: RouteType): Promise<any> {
    const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${VANCOUVER_LOCATION.lat},${VANCOUVER_LOCATION.lng}&destinations=${route.destination.lat},${route.destination.lng}&key=${API_KEY}`
    try {
      const data = await axios.get(URL);
      return data;
    } catch (error) {
      throw error
    }
  }

}
