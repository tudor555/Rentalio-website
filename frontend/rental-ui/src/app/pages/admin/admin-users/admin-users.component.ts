import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserSessionService } from '../../../services/user-session.service';
import { ConfirmationModalComponent } from '../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-admin-users',
  imports: [
    RouterModule,
    NgClass,
    NgIf,
    NgFor,
    FormsModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent {
  // ========== State Variables ==========
  
  users: any;

  page: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalItems: number = 0;
  searchTerm: string = '';

  selectedUser: any = null;
  showConfirmModal: boolean = false;
  confirmationAction: 'remove' | 'update' | null = null;
  modalTitle: string = '';
  confirmMessage: string = '';

  editUser: any = {};
  showEditModal = false;
  currentUserRole: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.currentUserRole = UserSessionService.isAdmin();
    this.fetchUsers();
  }

  // ========== Fetch & Search ==========

  fetchUsers() {
    const baseUrl = 'users/search';
    const params: string[] = [
      `page=${this.page}`,
      `pageSize=${this.pageSize}`,
      `sort=createdAt_desc`,
    ];

    // Only add filters if value is not empty
    if (this.searchTerm.trim()) {
      if (this.searchTerm.includes('@')) {
        params.push(`email=${this.searchTerm.trim()}`);
      } else {
        params.push(`username=${this.searchTerm.trim()}`);
      }
    }

    const query = `${baseUrl}?${params.join('&')}`;

    this.apiService.get<any>(query, true).subscribe((res) => {
      this.users = res.data;
      this.totalPages = res.totalPages || 1;
      this.totalItems = res.total || 0;
    });
  }

  searchByTitle(): void {
    this.page = 1; // reset to first page on new search
    this.fetchUsers();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.fetchUsers();
  }

  // ========== Remove User ==========

  // Opens confirmation modal for deleting a user
  openRemoveModal(user: any) {
    this.selectedUser = user;
    this.modalTitle = 'Confirm Deletion';
    this.confirmMessage = `Are you sure you want to delete user "${user.username}"?`;
    this.confirmationAction = 'remove';
    this.showConfirmModal = true;
  }

  // Cancels the remove action
  cancelRemove() {
    this.selectedUser = null;
    this.showConfirmModal = false;
    this.confirmationAction = null;
  }

  // Confirms and performs the user deletion (hard delete)
  confirmRemove() {
    if (!this.selectedUser) return;

    this.apiService.delete(`users/${this.selectedUser._id}`, true).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      },
    });
  }

  // ========== Edit User ==========

  // Opens the edit modal for selected user
  openEditModal(user: any) {
    this.selectedUser = user;
    this.editUser = { ...user }; // clone to avoid direct mutation
    this.showEditModal = true;
  }

  // Closes the edit modal
  closeEditModal() {
    this.showEditModal = false;
    this.showConfirmModal = false;
    this.selectedUser = null;
    this.editUser = {};
  }

  // Triggers confirmation before saving changes
  openConfirmModal() {
    this.modalTitle = 'Confirm Update';
    this.confirmMessage = `Are you sure you want to save changes to "${this.editUser.username}"?`;
    this.confirmationAction = 'update';
    this.showConfirmModal = true;
  }

  // Routes to the correct action based on current modal context
  confirm() {
    if (this.confirmationAction === 'remove') {
      this.confirmRemove();
    } else if (this.confirmationAction === 'update') {
      this.confirmUpdate();
    }
  }

  // Sends PATCH request to update user info
  confirmUpdate() {
    if (!this.selectedUser) {
      console.error('No selected user found for update');
      return;
    }

    const updates: any = {};

    if (this.editUser.username !== this.selectedUser.username) {
      updates.username = this.editUser.username;
    }

    if (this.editUser.role !== this.selectedUser.role) {
      updates.role = this.editUser.role;
    }

    // Only proceed if there are changes
    if (Object.keys(updates).length === 0) {
      this.closeEditModal();
      return;
    }

    this.apiService
      .patch(`users/${this.editUser._id}`, updates, true)
      .subscribe(() => {
        this.fetchUsers(); // Refresh list
        this.closeEditModal();
      });
  }

  // ========== Helpers ==========

  profilePicture(profilePicture: any): string {
    return profilePicture && profilePicture !== 'null'
      ? profilePicture
      : 'assets/images/profile/avatar-icon.jpg';
  }
}
