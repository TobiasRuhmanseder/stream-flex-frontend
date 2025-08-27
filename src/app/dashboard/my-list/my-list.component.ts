import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from 'src/app/services/favorite.service';
import { CardComponent } from 'src/app/features/card/card.component';
import { MovieService } from 'src/app/services/movie.service';
import { SpinnerLittleComponent } from "src/app/features/spinner-little/spinner-little.component";

@Component({
  selector: 'app-my-list',
  imports: [CardComponent, CommonModule, SpinnerLittleComponent,],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss'
})
export class MyListComponent implements OnInit {

  constructor(private movieService: MovieService, public readonly favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.favoriteService.load();
  }

}
