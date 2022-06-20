import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { DeveloperProfile } from 'src/app/developer-profile';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrls: ['./developer-profile.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: DeveloperProfileComponent}   
  ]
})

export class DeveloperProfileComponent implements OnInit {

  displayedColumns: string[] = ['id', 'username', 'email', 'phone_number', 'skillsets', 'hobby', 'actions'];
  dataSource: DeveloperProfile[] = [];
  developerProfile: any = {};
  developerToDelete?: DeveloperProfile;
  dialogActionLabel: string = 'Add New';

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

//#region MatChipInput
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skillsets_list: string[] = ['HTML', 'CSS', 'JavaScript'];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add skillset
    if (value) {
      this.skillsets_list.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(skillset: string): void {
    const index = this.skillsets_list.indexOf(skillset);

    if (index >= 0) {
      this.skillsets_list.splice(index, 1);
    }
  }
//#endregion

//#region Dialog
  @ViewChild('callCreateUpdateDeveloperDialog') callCreateUpdateDeveloperDialog!: TemplateRef<any>;
  @ViewChild('callDeleteDeveloperDialog') callDeleteDeveloperDialog!: TemplateRef<any>;

  onSend(form: NgForm){  
    if(form.status !== 'INVALID')
    {
      // inject MatChipInput to form value
      form.value.skillsets = this.skillsets_list;
      if(this.dialogActionLabel == 'Add New')
        this.createDeveloperProfile(form);
      else if(this.dialogActionLabel == 'Update')
        this.updateDeveloperProfile(form)
      this.dialog.closeAll();
    }
  }

  openCreateUpdateDeveloperDialog(dialogAction: string, developerProfile?:DeveloperProfile) {
    let dialogRef = this.dialog.open(this.callCreateUpdateDeveloperDialog);
    this.dialogActionLabel = dialogAction;

    if(this.dialogActionLabel == 'Add New')
      this.skillsets_list = ['HTML', 'CSS', 'JavaScript'];
    else if(this.dialogActionLabel == 'Update'){
      this.skillsets_list = developerProfile!.skillsets || [];
      this.selectDeveloperProfile(developerProfile);
    }

    dialogRef.afterClosed().subscribe(result => {
        // clear input field when closing form
        this.developerProfile = {};
        this.getDeveloperProfile();
    })
  }

  openDeleteDeveloperDialog(developer: DeveloperProfile) {
    let dialogRef = this.dialog.open(this.callDeleteDeveloperDialog);
    this.developerToDelete = developer;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'yes' ) 
        this.deleteDeveloperProfile(developer.id);
    })
  }
//#endregion

//#region API Service
  getDeveloperProfile(){
    this.apiService.readDeveloperProfiles().subscribe((result: any)=>{   
      this.dataSource = result;
    })
  }

  selectDeveloperProfile(developerProfile: any){
    this.developerProfile = developerProfile;
  }

  newDeveloperProfile(){
    this.developerProfile = {};
  }

  createDeveloperProfile(f: NgForm){
    this.apiService.createDeveloperProfile(f.value).subscribe((result)=>{
      this.getDeveloperProfile();
    });
    
  }

  updateDeveloperProfile(f: NgForm){
    f.value.id = this.developerProfile.id;
    this.apiService.updateDeveloperProfile(f.value).subscribe((result)=>{
      this.getDeveloperProfile()
    });
  }

  deleteDeveloperProfile(id: number){
    this.apiService.deleteDeveloperProfile(id).subscribe((result)=>{
      this.getDeveloperProfile()
    });
  }
//#endregion

  ngOnInit(): void {
    this.getDeveloperProfile()
  }

}
