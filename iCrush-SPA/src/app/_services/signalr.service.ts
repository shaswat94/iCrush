import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection;
  private builder = new HubConnectionBuilder();
  public connectionStatus;

  constructor() {
    this.hubConnection = this.builder.withUrl('http://localhost:5000/signalr').build();
    this.connectionStatus = this.hubConnection.state;
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

  onClose(): void {
    return this.hubConnection.onclose( async () => await this.hubConnection.start());
  }

  checkConnection(): string {
    switch (this.hubConnection.state) {
      case 0:
        return 'connecting';
      case 1:
        return 'connected';
      case 2:
        return 'reconnecting';
      case 4:
        return 'disconnected';
      default:
        return 'status NA';
    }
  }

  reconnect(): Promise<void> {
    if (this.hubConnection.state === 4) {
      return this.start();
    }

    return Promise.resolve();
  }
}
