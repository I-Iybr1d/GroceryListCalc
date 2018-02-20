
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';


@Component({
    selector: 'list-picker-modal',
    templateUrl: 'list-picker-modal.html',
})
export class ListPickModal {
    private arrayList = this.navParams.get('item');

    constructor(private navParams: NavParams, private view: ViewController) { }
  
    ionViewWillLoad() {
        console.log(this.arrayList);
    }

    LoadList(i: number) {
        let action = "select";
        this.view.dismiss({ index: i, action: action });
    }

    RenameList(i: number) {
        let action = "rename";
        this.view.dismiss({ index: i, action: action });
    }

    DeleteList(i: number) {
        let action = "delete";
        this.view.dismiss({ index: i, action: action });
    }

    CloseModal(i: number) {
        let action = "none";
        this.view.dismiss({ index: 0, action: action });
    }
}