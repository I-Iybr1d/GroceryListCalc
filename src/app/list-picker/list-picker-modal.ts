
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'list-picker-modal',
    templateUrl: 'list-picker-modal.html',
})
export class ListPickModal {
    public arrayList = new Array<string>();
    private selectedIndex: number;
    //private regex = new RegExp('^[a-z0-9_-]*$');

    constructor(private navParams: NavParams, private view: ViewController) {
        this.arrayList = this.navParams.get('item');
    }
  
    ionViewWillLoad() {
        console.log(this.arrayList);
    }

    LoadList(selected: number) {
        let action = "select";
        this.view.dismiss({ index: this.selectedIndex, action: action });
    }

    RenameList() {
        let action = "rename";
        this.view.dismiss({ index: this.selectedIndex, action: action });
    }

    DeleteList() {
        let action = "delete";
        this.view.dismiss({ index: this.selectedIndex, action: action });
    }

    CloseModal() {
        let action = "none";
        this.view.dismiss({ index: 0, action: action });
    }

    private CheckIfSelected(index: number): string {
        return this.selectedIndex == index ? 'primary' : 'secondary';
    }

    private SelectRow(index: number) {
        this.selectedIndex = index;
    }
}