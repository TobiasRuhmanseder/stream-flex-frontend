import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from 'src/app/services/favorite.service';
import { CardComponent } from 'src/app/features/card/card.component';
import { MovieService } from 'src/app/services/movie.service';
import { SpinnerLittleComponent } from "src/app/features/spinner-little/spinner-little.component";
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

@Component({
  selector: 'app-my-list',
  imports: [CardComponent, CommonModule, SpinnerLittleComponent, TranslatePipe],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss'
})
/**
 * This is the component for showing the user's favorite movies list.
 */
export class MyListComponent implements OnInit {

  /**
   * Sets up the movie service and favorite service.
   */
  constructor(private movieService: MovieService, public readonly favoriteService: FavoriteService) { }

  /**
   * When the component starts, load the list of favorites.
   */
  ngOnInit(): void {
    this.favoriteService.load();
  }

}
