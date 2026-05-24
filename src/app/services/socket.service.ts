import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private messageSubject = new Subject<any>();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${environment.scheme}${environment.apiUrl}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('[Socket] connected:', this.socket.id);
    });

    this.socket.on('connect_error', (err: Error) => {
      console.error('[Socket] connection error:', err.message);
    });

    this.socket.on('receiveMessage', (msg: any) => {
      this.messageSubject.next(msg);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(to: string, message: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        return reject(new Error('Socket not connected'));
      }
      this.socket.emit('sendMessage', { to, message }, (ack: any) => {
        if (ack?.err) reject(new Error(ack.msg));
        else resolve(ack);
      });
    });
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  reconnectWithToken(token: string) {
    if (!this.socket) return;
    this.socket.auth = { token };
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  get isConnected(): boolean {
    return !!this.socket?.connected;
  }
}
