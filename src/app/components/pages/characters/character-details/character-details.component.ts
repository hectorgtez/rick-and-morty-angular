import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, take } from 'rxjs';

import { Character } from '@shared/interfaces/character.interface';
import { CharacterService } from '@shared/services/character.service';

@Component({
  selector: 'app-character-details',
  standalone: false,

  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss'
})
export class CharacterDetailsComponent implements OnInit {
  character$?: Observable<Character>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private characterService: CharacterService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe( take(1) )
      .subscribe( (params) => {
        const id = params['id'];
        this.character$ = this.characterService.getDetails(id);
      });
  }

  onGoBack(): void {
    this.location.back();
    // windows.history.back();
  }
}
