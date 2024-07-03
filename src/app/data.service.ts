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

  fetchData(): Observable<any[]> {
    const localData = localStorage.getItem(this.localStorageKey);
    if (localData) {
      return of(JSON.parse(localData));
    } else {
      return this.http.get<any[]>(this.jsonUrl);
    }
  }

  private isSelected = new BehaviorSubject<any>(null);
  isSelected$ = this.isSelected.asObservable();

  setSelected(data: any) {
    this.isSelected.next(data);
  }
}
