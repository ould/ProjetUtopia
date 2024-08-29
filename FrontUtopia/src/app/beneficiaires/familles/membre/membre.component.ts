import { Component, HostListener, Input } from '@angular/core';
import { Membre } from '../models/membre';

@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.css']
})
export class MembreComponent {

  @Input() membresInput: Membre[] = [];
  @Input() modificationEnCours: boolean = true;
  currentPersonneIndex: number = 0;
  startX: number | null = null;
  deltaX: number = 0;
  touchThreshold: number = 50;

  get currentMember() {
    return this.membresInput[this.currentPersonneIndex];
  }

  ajouterPersonne() {
    this.membresInput.push({ nom: '' });
    this.currentPersonneIndex
      = this.membresInput.length - 1;
  }

  @HostListener('mousedown', ['$event']) @HostListener('touchstart', ['$event']) onStart(event: MouseEvent | TouchEvent) { const e = event as MouseEvent | TouchEvent; this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX; this.deltaX = 0; }
  @HostListener('mousemove', ['$event']) @HostListener('touchmove', ['$event']) onMove(event: MouseEvent | TouchEvent) {
    if (this.startX === null) return;
    const e = event as MouseEvent | TouchEvent;
    this.deltaX = e instanceof MouseEvent ? e.clientX - this.startX : e.touches[0].clientX - this.startX;
  }

  @HostListener('mouseup', ['$event']) @HostListener('touchend', ['$event']) onEnd(event: MouseEvent | TouchEvent) {
    if (Math.abs(this.deltaX) > this.touchThreshold) { if (this.deltaX < 0) { this.nextPersonne(); } else { this.prevPersonne(); } }
    this.resetTouch();
  }

  private resetTouch() { this.startX = null; this.deltaX = 0; }

  prevPersonne() { if (this.currentPersonneIndex > 0) { this.currentPersonneIndex--; } }

  nextPersonne() { if (this.currentPersonneIndex < this.membresInput.length - 1) { this.currentPersonneIndex++; } }
}