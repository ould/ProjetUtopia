import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Famille } from './models/famille';
import { FamilleService } from './famille.service';
import { UtilisateurService } from 'src/app/autres-services/utilisateur/utilisateur.service';
import { Section } from 'src/app/gestionApp/interfaces/section';
import { Autorisations } from 'src/app/gestionApp/interfaces/autorisations';


@Component({
    selector: 'app-familles',
    templateUrl: './familles.component.html',
    styleUrls: ['./familles.component.css'],
    standalone: false
})

export class FamillesComponent {
  autorisations!:Autorisations;
  barreRecherche: Boolean = true;
  familles$!: Observable<Famille[]>;
  famillesRecentes$?: Observable<Famille[]>;
  stats = {
    famillesVuesAujourdhui: 0,
    totalFamilles: 0
  };

  private searchTerms = new Subject<string>();

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.famillesRecentes$ = this.familleService.getFamillesRecentes();
    this.loadStats();
    this.familles$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.familleService.searchFamilles(term)),
    );
  }

  loadStats(): void {
    this.familleService.getStats().subscribe(data => {
      this.stats.famillesVuesAujourdhui = data.famillesVuesAujourdhui;
      this.stats.totalFamilles = data.totalFamilles;
    });
  }

  constructor(private familleService: FamilleService,
    private utilisateurService: UtilisateurService
  ) { 
    this.utilisateurService.getDroits(Section.famille).subscribe(
      (result) => this.autorisations = result
    )
  }


}

