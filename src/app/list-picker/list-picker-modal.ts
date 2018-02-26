
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import * as LanguageSets from '../resources/translation-sets';

@Component({
    selector: 'list-picker-modal',
    templateUrl: 'list-picker-modal.html',
})
export class ListPickerModal implements OnInit, OnChanges, OnDestroy{
    public arrayList = new Array<string>();
    private selectedIndex: number;
    language = new Array<string>();
    private languageListener: Subscription;
    //private regex = new RegExp('^[a-z0-9_-]*$');

    constructor
    (
        private navParams: NavParams,
        private view: ViewController,
        private translate: TranslateService)
    {
        this.arrayList = this.navParams.get('item');
        this.selectedIndex = -1;
    }
  
    ngOnInit() {
        console.log(this.arrayList);
        this.languageListener = this.translate.get(LanguageSets.listPickerModal).subscribe(list => this.language = list);
    }

    ngOnChanges() {

    }

    ngOnDestroy() {
        this.languageListener.unsubscribe();
    }

    LoadList(selected: number) {
        let action = "load";
        this.view.dismiss({ action: action, filename: this.arrayList[this.selectedIndex] });
    }

    RenameList() {
        let action = "rename";
        this.view.dismiss({ action: action, filename: this.arrayList[this.selectedIndex] });
    }

    DeleteList() {
        let action = "delete";
        this.view.dismiss({ action: action, filename: this.arrayList[this.selectedIndex] });
    }

    CloseModal() {
        let value = "none";
        this.view.dismiss({ action: value, filename: value });
    }

    private CheckIfSelected(index: number): string {
        return this.selectedIndex == index ? 'primary' : 'secondary';
    }

    private SelectRow(index: number) {
        this.selectedIndex = index;
    }
}