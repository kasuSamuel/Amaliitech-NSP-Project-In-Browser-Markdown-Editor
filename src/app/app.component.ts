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

  toggleSlideMenu() {
    const sidebar = document.querySelector('.nav-sidebar') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    const openMenu = document.querySelector('.openMenu') as HTMLElement;
    const closeMenu = document.querySelector('.closeMenu') as HTMLElement;

    if (sidebar && body) {
      if (sidebar.classList.contains('popUp')) {
        // Sidebar is open, close it
        sidebar.style.transition = 'transform 0.95s ease-in-out';
        sidebar.style.transform = 'translateX(-100%)';
        body.style.marginLeft = '0';

        if (openMenu) {
          openMenu.classList.remove('hidden');
        }
        if (closeMenu) {
          closeMenu.style.display = 'none';
        }

        sidebar.classList.remove('popUp');
        console.log('Sidebar closed');
      } else {
        // Sidebar is closed, open it
        sidebar.style.transition = 'transform 0.9s ease-in-out';
        sidebar.style.transform = 'translateX(0)';
        body.style.marginLeft = '240px';

        if (openMenu) {
          openMenu.classList.add('hidden');
        }
        if (closeMenu) {
          closeMenu.style.display = 'flex';
        }

        sidebar.classList.add('popUp');
        console.log('Sidebar opened');
      }
    }
  }

  viewDocument(document: any) {
    this.dataService.setSelected(document);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  newDocument(): void {
    const newDoc = {
      name: `untitled-document.md`,
      createdAt: this.formatDate(new Date()),
      content: '',
    };
    this.data.push(newDoc);
  }

  get reversedData() {
    return this.data.slice().reverse();
  }

  saveChanges() {
    if (this.selectedData) {
      const nameInput = document.querySelector(
        '.nameInput',
      ) as HTMLInputElement;
      const index = this.data.findIndex((doc) => doc === this.selectedData);
      if (index !== -1) {
        this.data[index].content = this.selectedData.content;
        if (nameInput.value) {
          this.data[index].name = this.selectedData.name = nameInput.value;
        }
        this.dataService.saveToLocalStorage(this.data);
        console.log(this.data[index]);
      }

      // Reload the page
      location.reload();
    }
  }

  lastData() {
    this.selectedData = this.data[this.data.length - 1];
  }

  deletedItem() {
    const popup = document.querySelector('.deletepopup') as HTMLElement | null;
    if (popup) {
      popup.style.display = 'flex';
    }
  }

  confirmAction() {
    if (this.selectedData) {
      const index = this.data.findIndex((doc) => doc === this.selectedData);

      if (index !== -1) {
        this.data.splice(index, 1); // Remove the selected file

        if (this.data.length > 0) {
          // Update selectedData to the latest or next file
          this.selectedData = this.data[Math.min(index, this.data.length - 1)];
        } else {
          this.selectedData = null;
        }

        this.dataService.saveToLocalStorage(this.data); // Save the updated data to local storage
      }
      // Optionally, hide the popup or perform any other UI updates
      const popup = document.querySelector(
        '.deletepopup',
      ) as HTMLElement | null;
      if (popup) {
        popup.style.display = 'none';
      }
      location.reload();
    }
  }
}
