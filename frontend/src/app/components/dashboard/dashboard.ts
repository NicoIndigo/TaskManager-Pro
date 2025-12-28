import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  };
  upcomingTasks: Task[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.calculateStats();
  }

  calculateStats() {
    this.taskService.getTasks().subscribe(res => {
      if (res.message === 'success') {
        const tasks: Task[] = res.data;
        this.stats.total = tasks.length;
        this.stats.completed = tasks.filter(t => t.status === 'completed').length;
        this.stats.pending = tasks.filter(t => t.status === 'pending').length;

        const now = new Date();
        // Comprobación de vencimiento simple: si dueDate < now y no completada
        // Nota: también podemos comprobar si el estado es 'overdue' si el backend lo establece.
        this.stats.overdue = tasks.filter(t => {
          if (t.status === 'completed') return false;
          // Usar estado 'overdue' si está establecido, o comprobar fecha
          if (t.status === 'overdue') return true;
          if (t.dueDate) {
            return new Date(t.dueDate) < now;
          }
          return false;
        }).length;

        this.stats.completionRate = this.stats.total > 0
          ? Math.round((this.stats.completed / this.stats.total) * 100)
          : 0;

        this.upcomingTasks = tasks
          .filter(t => t.status === 'pending' && t.dueDate)
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
          .slice(0, 5);

        this.cdr.detectChanges();
      }
    });
  }
}
