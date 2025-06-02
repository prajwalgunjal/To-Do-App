// todo-form/todo-form.component.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  @Output() todoAdd = new EventEmitter<string>();
  
  todoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      todoText: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.todoForm.valid) {
      const todoText = this.todoForm.get('todoText')?.value?.trim();
      if (todoText) {
        this.todoAdd.emit(todoText);
        this.todoForm.reset();
      }
    }
  }
}