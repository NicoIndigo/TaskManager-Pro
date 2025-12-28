import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<Task>();

  onDelete() {
    if (this.task.id) {
      this.delete.emit(this.task.id);
    }
  }

  toggleStatus() {
    const newStatus = this.task.status === 'completed' ? 'pending' : 'completed';
    this.task.status = newStatus;
    this.statusChange.emit(this.task);
  }

  get remainingTime(): string {
    if (!this.task.dueDate || this.task.status === 'completed') return '';
    const now = new Date();
    const due = new Date(this.task.dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return 'Vencida';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} días restantes`;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} horas restantes`;
  }
}
