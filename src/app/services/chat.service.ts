import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  private get base() { return this.authService.getSubDomain(); }

  // POST /api/chat/send  body: { to, message }
  sendMessage(to: string, message: string): Observable<any> {
    return this.http.post(`${this.base}/api/chat/send`, { to, message });
  }

  // POST /api/chat/conversation  body: { withUserId }
  getConversation(withUserId: string): Observable<any> {
    return this.http.post(`${this.base}/api/chat/conversation`, { withUserId });
  }

  // POST /api/chat/conversations  (admin only)
  getConversations(): Observable<any> {
    return this.http.post(`${this.base}/api/chat/conversations`, {});
  }

  // GET /api/chat/admins
  getAdmins(): Observable<any> {
    return this.http.get(`${this.base}/api/chat/admins`);
  }
}
