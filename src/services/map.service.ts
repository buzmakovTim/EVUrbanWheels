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
}
