import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, take } from 'rxjs';

import { Character } from '@shared/interfaces/character.interface';
import { CharacterService } from '@shared/services/character.service';

type RequestInfo = {
  next: string;
}

@Component({
  selector: 'app-character-list',
  standalone: false,

  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  private pageNum: number = 1;
  private query: string = '';
  private hideScrollHeight: number = 200;
  private showScrollHeight: number = 500;

  characters: Character[] = [];
  showGoUpButton = false;
  info: RequestInfo = {
    next: ''
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.onUrlChanged();
  }

  ngOnInit(): void {
    this.getCharactersByQuery();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const yOffset = window.pageYOffset;
    if ((yOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton && (yOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }
  }

  onScrollDown(): void {
    if (this.info.next) {
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop(): void {
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Others
  }

  private onUrlChanged(): void {
    this.router.events.pipe( filter((event) => event instanceof NavigationEnd) )
      .subscribe( () => {
        this.characters = [];
        this.pageNum = 1;
        this.getCharactersByQuery();
      });
  }

  private getCharactersByQuery(): void {
    this.route.queryParams
    .pipe( take(1) )
    .subscribe( (params: any) => {
      this.query = params['q'];
      this.getDataFromService();
    });
  }

  private getDataFromService(): void {
    this.characterService.searchCharacter(this.query, this.pageNum)
    .pipe( take(1) ).subscribe( (resp: any) => {
      if (resp?.results?.length) {
        const { info, results } = resp;

        this.characters = [...this.characters, ...results];
        this.info = info;
      } else {
        this.characters = [];
      }
    });
  }
}
