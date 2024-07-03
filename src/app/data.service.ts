import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = 'assets/data.json';
  private localStorageKey = 'document';
  localData: any;

  constructor(private http: HttpClient) {}

  saveToLocalStorage(document: any[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(document));
  }


}
