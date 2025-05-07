import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
identifier: string = '';
  constructor() { }

  setIdentifier(identifier: string): void{
    this.identifier = identifier;
  }

  getIdentifier(): string{
    return this.identifier;
  }

  clearIdentifier(): void{
    this.identifier = '';
  }
}
