import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  isAdmin = false;
  currentUserId = '';

  // User view
  admins: any[] = [];
  selectedAdmin: any = null;

  // Admin view
  conversations: any[] = [];
  selectedUser: any = null;

  messages: any[] = [];
  newMessage = '';
  sending = false;

  private msgSub!: Subscription;
  private shouldScroll = false;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private authService: AuthenticationService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit() {
    const perms = this.permissionsService.getPermissions();
    this.isAdmin = !!perms?.['Admin'];

    const userData = this.authService.getUserDetails;
    this.currentUserId = userData?.userDetail?.id || '';

    // Connect socket with JWT token
    const token = localStorage.getItem('token') || '';
    this.socketService.connect(token);

    // Listen for real-time incoming messages
    this.msgSub = this.socketService.onMessage().subscribe((msg: any) => {
      this.onSocketMessage(msg);
    });

    if (this.isAdmin) {
      this.loadConversations();
    } else {
      this.loadAdmins();
    }
  }

  // ── Socket message handler ────────────────────────────────

  onSocketMessage(msg: any) {
    const otherId = this.isAdmin
      ? this.selectedUser?._id?.toString()
      : this.selectedAdmin?._id?.toString();

    const fromId = msg.from?.toString();
    const toId   = msg.to?.toString();

    // If message belongs to the currently open conversation → push it
    if (otherId && (fromId === otherId || toId === otherId)) {
      // Avoid duplicate if same _id already in messages
      const alreadyExists = this.messages.some(
        (m: any) => m._id?.toString() === msg._id?.toString()
      );
      if (!alreadyExists) {
        this.messages.push(msg);
        this.shouldScroll = true;
      }
    }

    // Admin: always refresh conversation list so unread counts stay current
    if (this.isAdmin) {
      this.loadConversations();
    }
  }

  // ── Display helpers ───────────────────────────────────────

  adminDisplayName(admin: any): string {
    const fn = admin?.first_name || '';
    const ln = admin?.last_name || '';
    return (fn + ' ' + ln).trim() || admin?.email || 'Admin';
  }

  convDisplayName(conv: any): string {
    const fn = conv?.userInfo?.first_name || '';
    const ln = conv?.userInfo?.last_name || '';
    return (fn + ' ' + ln).trim() || conv?.userInfo?.email || 'User';
  }

  isMine(msg: any): boolean {
    const fromId = msg?.from?._id?.toString() || msg?.from?.toString() || '';
    return fromId === this.currentUserId;
  }

  // ── Data loading (REST — history + lists) ─────────────────

  loadAdmins() {
    this.chatService.getAdmins().subscribe({
      next: (res: any) => {
        this.admins = res?.payload || [];
        if (this.admins.length && !this.selectedAdmin) {
          this.selectedAdmin = this.admins[0];
          this.loadMessages();
        }
      },
      error: () => {}
    });
  }

  loadConversations() {
    this.chatService.getConversations().subscribe({
      next: (res: any) => { this.conversations = res?.payload || []; },
      error: () => {}
    });
  }

  loadMessages() {
    const withId = this.isAdmin ? this.selectedUser?._id : this.selectedAdmin?._id;
    if (!withId) return;

    this.chatService.getConversation(withId).subscribe({
      next: (res: any) => {
        this.messages = res?.payload || [];
        this.shouldScroll = true;
      },
      error: () => {}
    });
  }

  // ── User interactions ─────────────────────────────────────

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      if (this.isAdmin) {
        this.loadConversations();
      } else if (this.selectedAdmin) {
        this.loadMessages();
      }
    }
  }

  selectAdmin(admin: any) {
    this.selectedAdmin = admin;
    this.messages = [];
    this.loadMessages();
  }

  selectUser(conv: any) {
    this.selectedUser = conv;
    this.messages = [];
    this.loadMessages();
  }

  backToList() {
    this.selectedUser = null;
    this.messages = [];
    this.loadConversations();
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text || this.sending) return;

    const to = this.isAdmin ? this.selectedUser?._id : this.selectedAdmin?._id;
    if (!to) return;

    this.newMessage = '';
    this.sending = true;

    if (this.socketService.isConnected) {
      // Real-time send via Socket.io — server echoes receiveMessage back to sender
      this.socketService.sendMessage(to, text)
        .catch(() => {
          // Socket failed → fall back to REST and reload
          this.chatService.sendMessage(to, text).subscribe({
            next: () => this.loadMessages(),
            error: () => {}
          });
        })
        .finally(() => { this.sending = false; });
    } else {
      // Socket not connected — use REST
      this.chatService.sendMessage(to, text).subscribe({
        next: () => { this.loadMessages(); this.sending = false; },
        error: () => { this.sending = false; }
      });
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (_) {}
  }

  ngOnDestroy() {
    this.msgSub?.unsubscribe();
    this.socketService.disconnect();
  }
}
