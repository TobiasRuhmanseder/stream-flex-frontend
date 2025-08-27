import { Component } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { CardComponent } from 'src/app/features/card/card.component';
import { SpinnerLittleComponent } from 'src/app/features/spinner-little/spinner-little.component';


@Component({
  selector: 'app-search-view',
  imports: [CardComponent, SpinnerLittleComponent],
  templateUrl: './search-view.component.html',
  styleUrl: './search-view.component.scss'
})
export class SearchViewComponent {

  constructor(readonly searchService: SearchService) { }

}