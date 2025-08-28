import { Component } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { CardComponent } from 'src/app/features/card/card.component';
import { SpinnerLittleComponent } from 'src/app/features/spinner-little/spinner-little.component';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';


/**
 * SearchViewComponent displays search results and manages the interaction with the SearchService.
 * It utilizes reusable components such as CardComponent and SpinnerLittleComponent to present data and loading states.
 */
@Component({
  selector: 'app-search-view',
  imports: [CardComponent, SpinnerLittleComponent, TranslatePipe],
  templateUrl: './search-view.component.html',
  styleUrl: './search-view.component.scss'
})
export class SearchViewComponent {

  constructor(readonly searchService: SearchService) { }

}