// app.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoListComponent, Todo, TodoEvent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TodoFormComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  todos: Todo[] = [];
  isDarkTheme = false;
  nextId = 1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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

  addTodo(todoText: string) {
    const newTodo: Todo = {
      id: this.nextId++,
      text: todoText,
      completed: false,
      createdAt: new Date(),
      isEditing: false
    };
    this.todos.unshift(newTodo);
    this.saveTodos();
  }

  handleTodoAction(event: TodoEvent) {
    switch (event.action) {
      case 'toggle':
        event.todo.completed = !event.todo.completed;
        this.saveTodos();
        break;
      
      case 'delete':
        this.todos = this.todos.filter(todo => todo.id !== event.todo.id);
        this.saveTodos();
        break;
      
      case 'edit':
        if (event.newText) {
          event.todo.text = event.newText;
          event.todo.isEditing = false;
          this.saveTodos();
        }
        break;
    }
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
}