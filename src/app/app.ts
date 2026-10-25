import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InterfaceComponent } from './Components/interface-component/interface-component';
import { HelpComponent } from './Components/help-component/help-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatDialogModule, InterfaceComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('twic');

  constructor(private dialog: MatDialog) {}

  openHelpDialog(): void {
    this.dialog.open(HelpComponent, {
      ariaLabelledBy: 'help-dialog-title',
      maxWidth: '90vw',
      width: '900px',
    });
  }
}
