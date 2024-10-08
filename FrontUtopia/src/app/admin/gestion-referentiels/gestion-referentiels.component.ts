import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Referentiel } from 'src/app/interfaces/referentiel';
import { ReferentielsService } from './referentiels.service';
import { AntenneService } from 'src/app/autres-services/antenne/antenne.service';
import { Antenne } from 'src/app/interfaces/antenne';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gestion-referentiels',
  templateUrl: './gestion-referentiels.component.html',
  styleUrls: ['./gestion-referentiels.component.css']
})
export class GestionReferentielsComponent implements OnInit {

  referentiels: Referentiel[] = [];
  newReferentielName: string = '';

  constructor(
    private referentielService: ReferentielsService,
    private antenneService:AntenneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReferentiels();
  }

  loadReferentiels(): void {
    this.referentielService.getAll().subscribe(async (data: Referentiel[]) => {
      this.referentiels = data;
  
      // Création d'un tableau de promesses pour chaque nom d'antenne
      const promises = this.referentiels.map(async (referentiel) => {
        referentiel.nomAntenne = await this.getNomAntenneByID(referentiel.antenneId);
        referentiel.entitee = referentiel.entitee ?? "Global"
      });
  
      // Attente de toutes les promesses
      await Promise.all(promises);
    });
  }

  creerReferentiel(input: HTMLInputElement): void {
    if (!input.value.trim()) return;
    this.referentielService.createReferentiel(input.value).subscribe(() => {
      this.loadReferentiels();
      input.value = '';
    });
  }

  openPopupSuppression(nom: string, id: string): void {
    if (confirm(`Voulez-vous vraiment supprimer le référentiel "${nom}" ?`)) {
      this.referentielService.deleteReferentiel(id).subscribe(() => {
        this.loadReferentiels();
      });
    }
  }

  editReferentiel(id: string): void {
    this.router.navigate(['admin/referentiel', id]); // Navigue vers le composant de détail
  }

  async getNomAntenneByID(id: string|undefined) {
    if (!id?.trim()) return "Global";
    const requete$ = this.antenneService.getById(id).pipe();
    const antenne = await firstValueFrom(requete$);
    return antenne?.nom || "Global?"
  }
}
