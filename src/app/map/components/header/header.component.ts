import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() idDisplay = true;
  @Output() menuClick = new EventEmitter();

  handleMenuClick() {
    this.menuClick.emit();
  }
}
