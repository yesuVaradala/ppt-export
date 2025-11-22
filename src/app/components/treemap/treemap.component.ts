import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-treemap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treemap.component.html',
  styleUrl: './treemap.component.css'
})
export class TreemapComponent implements OnInit {
  boxes: any[] = [];
  colors = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#8bc34a', '#ffc107'];

  ngOnInit() {
    const sizes = [40, 30, 15, 10, 5];
    this.boxes = sizes.map((size, i) => ({
      size, color: this.colors[i], label: `Item ${i + 1}`
    }));
  }
}
