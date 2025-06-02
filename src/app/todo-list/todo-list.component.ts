// todo-list/todo-list.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  isEditing?: boolean;
}

export interface TodoEvent {
  action: 'toggle' | 'delete' | 'edit';
  todo: Todo;
  newText?: string;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() todoAction = new EventEmitter<TodoEvent>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      editText: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {}

  get completedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  get pendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  toggleComplete(todo: Todo) {
    this.todoAction.emit({ action: 'toggle', todo });
  }

  deleteTodo(todo: Todo) {
    this.todoAction.emit({ action: 'delete', todo });
  }

  startEdit(todo: Todo) {
    // Cancel other edits first
    this.todos.forEach(t => t.isEditing = false);
    // Start editing this todo
    todo.isEditing = true;
    this.editForm.patchValue({ editText: todo.text });
  }

  saveEdit(todo: Todo) {
    if (this.editForm.valid) {
      const newText = this.editForm.get('editText')?.value?.trim();
      if (newText) {
        this.todoAction.emit({ action: 'edit', todo, newText });
        todo.isEditing = false;
      }
    }
  }

  cancelEdit(todo: Todo) {
    todo.isEditing = false;
    this.editForm.reset();
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}