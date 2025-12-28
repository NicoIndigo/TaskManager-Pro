export interface Task {
    id?: number;
    title: string;
    description: string;
    status: 'completed' | 'pending' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    createdAt?: string;
    dueDate?: string;
}
