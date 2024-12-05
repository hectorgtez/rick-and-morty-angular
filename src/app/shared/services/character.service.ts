import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment.development';
import { Character } from '@shared/interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private http: HttpClient) { }

  searchCharacter(query = '', page = 1) {
    return this.http.get<Character[]>(`${ environment.baseUrl }/?name=${ query }&page=${ page }`);
  }

  getDetails(id: number) {
    return this.http.get<Character>(`${ environment.baseUrl }/${ id }`);
  }
}
