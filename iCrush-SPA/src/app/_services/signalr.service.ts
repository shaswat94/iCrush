import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubConnection: HubConnection;
  builder = new HubConnectionBuilder();

  constructor() {
  this.hubConnection = this.builder.withUrl('http://localhost:5000/signalr').build();
}

  start(): Promise<void> {
    return this.hubConnection.start();
  }

  on(methodName: string, newMethod: (...args: any[]) => void): void {
    this.hubConnection.on(methodName, newMethod);
  }

  invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    return this.hubConnection.invoke(methodName, ...args);
  }

  stop(): Promise<void> {
    return this.hubConnection.stop();
  }
}
