import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filters = {
    status: '',
    priority: '',
    search: ''
  };

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.filters.status, this.filters.priority, this.filters.search)
      .subscribe(res => {
        if (res.message === 'success') {
          this.tasks = res.data;
          this.cdr.detectChanges();
        }
      });
  }

  onFilterChange() {
    this.loadTasks();
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  onStatusChange(task: Task) {
    if (task.id) {
      this.taskService.updateTask(task.id, { status: task.status }).subscribe();
    }
  }
}
