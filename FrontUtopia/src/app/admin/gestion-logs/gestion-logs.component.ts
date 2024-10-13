import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/gestionApp/interfaces/log';
import { LogsService } from './logs.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-gestion-logs',
  templateUrl: './gestion-logs.component.html',
  styleUrls: ['./gestion-logs.component.css']
})
export class GestionLogsComponent implements OnInit {
  logs: Log[] = [];
  loading: boolean = true;
  
  // Pagination variables
  page: number = 1; // Current page
  totalLogs: number = 0; // Total number of logs
  itemsPerPage: number = 10; // Number of logs per page

  constructor(private logService: LogsService) {}

  ngOnInit(): void {
    this.fetchlog(this.page);
  }

  fetchlog(page: number): void {
    this.loading = true;
    this.logService.getLogParPage(page, this.itemsPerPage).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des logs', error);
        this.loading = false;
        return of({ total: 0, logs: [] }); // Retourne une valeur par défaut en cas d'erreur
      })
    ).subscribe((result: { total: number; logs: Log[] }) => {
      this.logs = result.logs;
      this.totalLogs = result.total;
      this.loading = false;
    });
  }

  // Function to handle page change
  onPageChange(page: number): void {
    this.page = page;
    this.fetchlog(this.page);
  }

  // Getter to calculate total pages
  get totalPages(): number {
    return Math.ceil(this.totalLogs / this.itemsPerPage);
  }
}
