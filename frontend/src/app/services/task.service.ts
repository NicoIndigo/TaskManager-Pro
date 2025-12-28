import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:3000/api/tasks'; // URL directa por ahora 
    // En producción (docker) esto debería diferir o ser relativo si se sirve desde el mismo origen.
    // Idealmente usar variables de entorno. Para este prototipo, usaré ruta relativa y proxy para desarroll.

    constructor(private http: HttpClient) {
        // Comprobar si estamos en desarrollo o prod (lógica simplificada o simplemente usar relativa)
        const isDev = window.location.port === '4200';
        if (!isDev) {
            this.apiUrl = '/api/tasks';
        }
    }

    getTasks(status?: string, priority?: string, search?: string): Observable<any> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        if (priority) params = params.set('priority', priority);
        if (search) params = params.set('search', search);

        console.log('TaskService: Solicitando tareas a', this.apiUrl, 'con params:', params.toString());
        return this.http.get<any>(this.apiUrl, { params });
    }

    getTask(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createTask(task: Task): Observable<any> {
        return this.http.post<any>(this.apiUrl, task);
    }

    updateTask(id: number, task: Partial<Task>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, task);
    }

    deleteTask(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
