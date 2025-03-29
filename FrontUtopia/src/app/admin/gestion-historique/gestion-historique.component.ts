import { Component, OnInit } from '@angular/core';
import { Historique } from 'src/app/gestionApp/interfaces/historique';
import { HistoriqueService } from './historique.service';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-gestion-historique',
    templateUrl: './gestion-historique.component.html',
    styleUrls: ['./gestion-historique.component.css'],
    standalone: false
})
export class GestionHistoriqueComponent implements OnInit {
  historiques: Historique[] = [];
  loading: boolean = true;
  
  // Pagination variables
  page: number = 1; // Current page
  totalHistoriques: number = 0; // Total number of historiques
  itemsPerPage: number = 10; // Number of historiques per page

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.fetchHistorique(this.page);
  }

  fetchHistorique(page: number): void {
    this.loading = true;
    this.historiqueService.getHistoriqueParPage(page, this.itemsPerPage).subscribe(
      (response: { total: number, historiques: Historique[] }) => {
        this.historiques = response.historiques;
        this.totalHistoriques = response.total;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’historique', error);
        this.loading = false;
      }
    );

    this.loading = true;
    this.historiqueService.getHistoriqueParPage(page, this.itemsPerPage).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de l’historique', error);
        this.loading = false; // Assure que l'indicateur de chargement est désactivé même en cas d'erreur
        return of({ total: 0, historiques: [] }); // Retourne une valeur par défaut pour éviter des erreurs côté vue
      })
    ).subscribe((result: { total: number; historiques: Historique[] }) => {
      this.historiques = result.historiques; // Met à jour la liste des historiques
      this.totalHistoriques = result.total; // Met à jour le total pour la pagination
      this.loading = false; // Désactive l'indicateur de chargement après récupération des données
    });
  }

  // Function to handle page change
  onPageChange(page: number): void {
    this.page = page;
    this.fetchHistorique(this.page);
  }

  // Getter to calculate total pages
  get totalPages(): number {
    return Math.ceil(this.totalHistoriques / this.itemsPerPage);
  }
}