import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Activity {
  icon: string;
  text: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-activity-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-widget.component.html',
  styleUrl: './activity-widget.component.css'
})
export class ActivityWidgetComponent implements OnInit {
  activities: Activity[] = [];

  ngOnInit() {
    this.activities = [
      { icon: '📄', text: 'New document created', time: '2 min ago', color: '#1976d2' },
      { icon: '✅', text: 'Task completed successfully', time: '15 min ago', color: '#4caf50' },
      { icon: '👤', text: 'User profile updated', time: '1 hour ago', color: '#ff9800' },
      { icon: '🔔', text: 'New notification received', time: '2 hours ago', color: '#9c27b0' },
      { icon: '📊', text: 'Report generated', time: '3 hours ago', color: '#f44336' }
    ];
  }
}
