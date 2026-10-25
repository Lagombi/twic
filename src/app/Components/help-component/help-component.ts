import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [MatButtonModule, MatCardModule, MatDialogModule, NgOptimizedImage],
  selector: 'app-help-component',
  styleUrl: './help-component.scss',
  templateUrl: './help-component.html',
})
export class HelpComponent {
  constructor(private dialogRef: MatDialogRef<HelpComponent>) {}

  protected readonly steps = [
    { image: 'step1.png', width: 505, height: 329, alt: 'Help instructions, step 1', description: 'Paste the JSON file into any Discord chat you wish. (I use a personal notepad channel.)' },
    { image: 'step2.png', width: 858, height: 242, alt: 'Help instructions, step 2', description: 'Click the "Download" button.' },
    { image: 'step3.png', width: 1289, height: 144, alt: 'Help instructions, step 3', description: 'Your web browser will navigate to the download URL of the JSON. (It\'ll download the file again, but you only need the url.) Copy it!' },
    { image: 'step4.png', width: 234, height: 234, alt: 'Help instructions, step 4', description: 'Go to Twinleaf.gg and log in. Click your icon in the top and click "Show Profile".' },
    { image: 'step5.png', width: 233, height: 298, alt: 'Help instructions, step 5', description: 'Click "Edit Profile", and then click "Images".' },
    { image: 'step6.png', width: 640, height: 482, alt: 'Help instructions, step 6', description: 'Paste the copied URL into the input field and save your changes.' },
  ];

  close(): void {
    this.dialogRef.close();
  }
}
