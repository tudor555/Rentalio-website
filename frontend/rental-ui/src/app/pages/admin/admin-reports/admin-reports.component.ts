import { DecimalPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-reports',
  imports: [RouterModule, FormsModule, BaseChartDirective, DecimalPipe, NgFor],
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
  revenueChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [], // monthly revenue
        label: 'Revenue',
        backgroundColor: '#38bdf8', // cyan
        borderRadius: 6,
        maxBarThickness: 60,
      },
      {
        data: [], // monthly cancellations
        label: 'Cancellations',
        backgroundColor: '#f87171', // red
        borderRadius: 6,
        maxBarThickness: 60,
      },
    ],
  };

  // Optional: Chart options
  revenueChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: 'Revenue vs Cancellations',
        color: '#D97B43',
        font: { size: 20, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Revenue') {
              return `$${context.parsed.y.toLocaleString()}`;
            }
            return `${context.parsed.y} cancellations`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000000' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: { color: '#000000' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  };

  // Top rentals
  topRentals: {
    rentalId: string;
    rentalTitle: string;
    owner: string;
    reservations: number;
    siteRevenue: number;
  }[] = [];

  // Reservation status distribution
  reservationStatusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'], // green, yellow, red
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 20,
      },
    ],
  };

  reservationsStatusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    aspectRatio: 2, 
    layout: {
      padding: 20, // space around chart
    },
    plugins: {
      legend: {
        position: 'left', 
        labels: {
          color: '#fff',
          font: { size: 16, weight: 'bold' },
          padding: 25, 
          generateLabels: (chart) => {
            const data = chart.data.datasets[0].data as number[];
            const total = data.reduce((a, b) => a + (b || 0), 0);

            return chart.data.labels!.map((label, i) => {
              const value = data[i] || 0;
              const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
              const backgroundColor = (
                chart.data.datasets[0].backgroundColor as string[]
              )[i];

              return {
                text: `${label}: ${value} (${percentage}%)`,
                fillStyle: backgroundColor,
                strokeStyle: backgroundColor,
                lineWidth: 2,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((a, b) => a + (b || 0), 0);
            const value = dataset[context.dataIndex] || 0;
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
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
    this.fetchMonthlyRevenue();
    this.fetchTopRentals();
    this.fetchReservationStatus();
  }

  // Fetch KPI cards data
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

  // Fetch monthly revenue + cancellations
  fetchMonthlyRevenue(): void {
    const params = new URLSearchParams();
    if (this.startDate) params.set('startDate', this.startDate);
    if (this.endDate) params.set('endDate', this.endDate);

    this.apiService
      .get<any>(`reports/revenue/monthly?${params.toString()}`, true)
      .subscribe({
        next: (res) => {
          const rows = res.data || [];

          this.revenueChartData = {
            labels: rows.map((r: any) => this.formatMonthLabel(r.month)),
            datasets: [
              {
                label: 'Revenue',
                data: rows.map((r: any) => r.revenue),
                backgroundColor: '#38bdf8',
                borderRadius: 6,
                maxBarThickness: 60,
              },
              {
                label: 'Cancellations',
                data: rows.map((r: any) => r.cancellations ?? 0),
                backgroundColor: '#f87171',
                borderRadius: 6,
                maxBarThickness: 60,
              },
            ],
          };
        },
        error: (err) => {
          console.error('Failed to fetch monthly revenue', err);
        },
      });
  }

  // Fetch top performing rentals
  fetchTopRentals(): void {
    const params = new URLSearchParams();
    if (this.startDate) params.set('startDate', this.startDate);
    if (this.endDate) params.set('endDate', this.endDate);

    this.apiService
      .get<any>(`reports/top-rentals?${params.toString()}`, true)
      .subscribe({
        next: (res) => {
          this.topRentals = res.data || [];
        },
        error: (err) => {
          console.error('Failed to fetch top rentals', err);
        },
      });
  }

  // Fetch reservations status
  fetchReservationStatus(): void {
    const params = new URLSearchParams();
    if (this.startDate) params.set('startDate', this.startDate);
    if (this.endDate) params.set('endDate', this.endDate);

    this.apiService
      .get<any>(`reports/reservations/status?${params.toString()}`, true)
      .subscribe({
        next: (res) => {
          this.reservationStatusChartData = {
            labels: ['Confirmed', 'Pending', 'Cancelled'],
            datasets: [
              {
                data: [res.confirmed, res.pending, res.cancelled],
                backgroundColor: ['#22c55e', '#facc15', '#ef4444'], // green, yellow, red
                borderWidth: 1,
                hoverOffset: 15,
              },
            ],
          };
        },
        error: (err) => {
          console.error('Failed to fetch reservation status', err);
        },
      });
  }

  applyFilters() {
    this.fetchKpis();
    this.fetchMonthlyRevenue();
    this.fetchTopRentals();
    this.fetchReservationStatus();
  }

  private formatMonthLabel(month: string): string {
    const [year, monthNum] = month.split('-');
    const date = new Date(Number(year), Number(monthNum) - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }

  downloadReport() {
    console.log('Download report for range:', this.startDate, this.endDate);
    // TODO: implement CSV/PDF download
  }
}
