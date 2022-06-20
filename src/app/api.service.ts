import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeveloperProfile } from './developer-profile';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_SERVER = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  public readDeveloperProfiles(){
    return this.httpClient.get<DeveloperProfile[]>(`${this.API_SERVER}/developers`);
  }

  public createDeveloperProfile(contact: DeveloperProfile){
    return this.httpClient.post<DeveloperProfile>(`${this.API_SERVER}/developers/create`, contact);
  }

  public updateDeveloperProfile(contact: DeveloperProfile){
    return this.httpClient.put<DeveloperProfile>(`${this.API_SERVER}/developers/${contact.id}/update`, contact);
  }

  public deleteDeveloperProfile(id: number){
    return this.httpClient.delete(`${this.API_SERVER}/developers/${id}/delete`);
  }
}
