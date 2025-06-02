// header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() isDarkTheme: boolean = false;
  @Output() themeToggle = new EventEmitter<void>();

  onThemeToggle() {
    this.themeToggle.emit();
  }
}