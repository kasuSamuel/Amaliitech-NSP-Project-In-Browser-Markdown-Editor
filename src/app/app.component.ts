import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MarkdownModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  markdown = ``;
  data: any[] = [];
  selectedData: any;
  isDark: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData().subscribe((data) => {
      this.data = data;
      this.selectedData = this.data[this.data.length - 1];
    });

    this.dataService.isSelected$.subscribe((doc) => {
      this.selectedData = doc;
    });

    if (this.data.length > 0 && !this.selectedData) {
      this.lastData();
    }

    this.isDark = localStorage.getItem('isDark') === 'dark';
    this.themeToggle();
  }
}
