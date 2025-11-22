import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.css'
})
export class StatsWidgetComponent {
  @Input() title: string = 'Stats';
  @Input() value: string = '0';
  @Input() subtitle: string = '';
  @Input() icon: string = '📊';
  @Input() color: string = '#1976d2';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() trendValue: string = '';
}
