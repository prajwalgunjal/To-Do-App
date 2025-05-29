import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  isEditing?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  todoForm: FormGroup;
  editForm: FormGroup;
  todos: Todo[] = [];
  isDarkTheme = false;
  nextId = 1;

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.todoForm = this.fb.group({
      todoText: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.editForm = this.fb.group({
      editText: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    // Only run browser-specific code if we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Load theme preference
      const savedTheme = localStorage.getItem('theme');
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();

      // Load todos from localStorage
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        try {
          this.todos = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            isEditing: false // Ensure editing state is reset
          }));
          this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
        } catch (error) {
          console.error('Error loading todos:', error);
          this.todos = [];
        }
      }
    }
  }

  addTodo() {
    if (this.todoForm.valid) {
      const todoText = this.todoForm.get('todoText')?.value?.trim();
      if (todoText) {
        const newTodo: Todo = {
          id: this.nextId++,
          text: todoText,
          completed: false,
          createdAt: new Date(),
          isEditing: false
        };
        this.todos.unshift(newTodo);
        this.todoForm.reset();
        this.saveTodos();
      }
    }
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  toggleComplete(todo: Todo) {
    // Toggle the specific todo's completion status
    todo.completed = !todo.completed;
    this.saveTodos();
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
        todo.text = newText;
        todo.isEditing = false;
        this.saveTodos();
      }
    }
  }

  cancelEdit(todo: Todo) {
    todo.isEditing = false;
    this.editForm.reset();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (this.isDarkTheme) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    }
  }

  private saveTodos() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      } catch (error) {
        console.error('Error saving todos:', error);
      }
    }
  }

  get completedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  get pendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  // Track by function for better performance with *ngFor
  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}