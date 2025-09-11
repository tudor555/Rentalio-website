import { DecimalPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-reports',
  imports: [FormsModule, BaseChartDirective, DecimalPipe, NgFor],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss',
})
export class AdminReportsComponent {
  // Filters
  startDate: string | null = null;
  endDate: string | null = null;

  kpis = {
    siteRevenue: 0,
    newUsers: 0,
    reservations: 0,
    cancellations: 0,
  };

  // Chart labels (months)
  chartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1200, 1500, 1800, 2200, 2000, 2500],
        label: 'Revenue',
        backgroundColor: '#38bdf8', // cyan
      },
      {
        data: [2, 3, 1, 5, 4, 2],
        label: 'Cancellations',
        backgroundColor: '#f87171', // red
      },
    ],
  };

  // Optional: Chart options
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#111', font: { weight: 'bold' } },
      },
      title: {
        display: true,
        text: 'Revenue vs Cancellations',
        color: '#111',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#111' }, grid: { color: '#eee' } },
      y: { ticks: { color: '#111' }, grid: { color: '#eee' } },
    },
  };

  topRentals = [
    {
      title: 'Cozy Apartment',
      owner: 'John Doe',
      reservations: 28,
      revenue: 3100,
    },
    {
      title: 'Beach House',
      owner: 'Jane Smith',
      reservations: 20,
      revenue: 5200,
    },
    {
      title: 'Mountain Cabin',
      owner: 'Emily Clark',
      reservations: 15,
      revenue: 2800,
    },
    {
      title: 'City Loft',
      owner: 'Michael Johnson',
      reservations: 12,
      revenue: 2400,
    },
  ];

  // Reservation status distribution
  statusChartData: ChartData<'doughnut'> = {
    labels: ['Confirmed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [342, 50, 16],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'], // green, yellow, red
        borderWidth: 1,
      },
    ],
  };

  statusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#000' },
      },
    },
  };

  loading: boolean = false;

  constructor(private apiService: ApiService) {}

  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.fetchKpis();
  }

  fetchKpis(): void {
    this.loading = true;

    const params = new URLSearchParams();
    if (this.startDate) params.set('startDate', this.startDate);
    if (this.endDate) params.set('endDate', this.endDate);

    this.apiService
      .get<any>(`reports/kpis?${params.toString()}`, true)
      .subscribe({
        next: (res) => {
          this.kpis = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch KPIs', err);
          this.loading = false;
        },
      });
  }

  applyFilters() {
    this.fetchKpis();
  }

  downloadReport() {
    console.log('Download report for range:', this.startDate, this.endDate);
    // TODO: implement CSV/PDF download
  }
}
