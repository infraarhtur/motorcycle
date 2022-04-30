import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../models/shared/navItem';
import { Router } from '@angular/router';
import { NavService} from 'src/app/services/shared/nav.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-list-items',
  templateUrl: './menu-list-items.component.html',
  styleUrls: ['./menu-list-items.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemsComponent implements OnInit {

  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = false;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(
    public router: Router,
    public navService: NavService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }

  }


  ngOnInit(): void {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  // tslint:disable-next-line: typedef
  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      this.navService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }



}
