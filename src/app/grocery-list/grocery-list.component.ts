import { Component, ChangeDetectorRef, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AlertController, Platform, ModalOptions, Modal, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { TranslateService } from '@ngx-translate/core';

import * as Globals from '../resources/globals';
import * as LanguageSets from '../resources/translation-sets';
import { IProduct } from './../resources/classes';
import { ListPickerModal } from '../list-picker/list-picker-modal';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'grocery-list',
  templateUrl: 'grocery-list.component.html'
})
export class GroceryListComponent implements OnInit, OnChanges, OnDestroy{
  // Service Variables
  language = new Array<string>();
  private languageListener: Subscription;
  debug: Array<string> = new Array<string>();
  // 

  // Data Variables
  products: Array<IProduct> = new Array<IProduct>();
  totalPrice: number;
  // 

  //#region Initialization
  constructor (
    private alertCtrl: AlertController,
    private _changeDetectionRef: ChangeDetectorRef,
    private file: File,
    private modalController: ModalController,
    private platform: Platform,
    private translate: TranslateService)
  {
    translate.setDefaultLang('pt-pt');
    this.totalPrice = 0;
    this.UpdateList();
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.languageListener = this.translate.get(LanguageSets.groceryListComponent).subscribe(list => this.language = list);
  }
  //#endregion

  //#region Update
  ngOnChanges() {

  }
    //#endregion

  //#region Finalization
  ngOnDestroy() {
    this.languageListener.unsubscribe();
  }
  //#endregion

  //#region Behaviours
  public AddNewItem() {
    this.products.reverse().push({Name: 'Nada', Price: 1, Quantity: 1, Discount: 0, Active: true });
    this.products.reverse();
    this._changeDetectionRef.detectChanges();
  }

  private UpdateList() {
    this.products.sort(Globals.CompareStrings);
    this.totalPrice = this.CalculateTotalPrice(this.products);
  }

  private CalculatePrice(item: IProduct): number {
    return (item.Price * item.Quantity) * (1 - item.Discount * 0.01)
  }

  private CalculateTotalPrice(items: Array<IProduct>): number {
    let total = 0;
    for (let item of this.products) {
      if(item.Active) {
        total += (item.Price * item.Quantity) * (1 - item.Discount * 0.01);
      }
    }
    return total;
  }

  public DeleteItem(currentItem) {
    this.products = this.products.filter(item => item !== currentItem);
    this.UpdateList();
  }

  public RemoveAllProducts(){
    this.products = new Array<IProduct>();
    this.UpdateList();
  }

  public NameChecker(name: string) {
    const regex = new RegExp('^[a-zA-Z0-9_.-]*$');
    let alert = this.alertCtrl.create(
      {
        title: this.language['InvalidName'],
        subTitle: name.length > 0 ? this.language['InvalidNameAlreadyExists'] : this.language['InvalidNamePleaseInsert'],
        buttons: ['OK']});
    alert.present();
  }
  //#endregion

  //#region Alerts
  private WarningDeleteProduct(item) {
    let alert = this.alertCtrl.create({
      title: this.language['DeleteProduct'],
      message: this.language['WishDeleteProduct'],
      buttons: [
        { text: this.language['Yes'], handler: () => { this.DeleteItem(item); } },
        { text: this.language['No'] }
      ]
    });
    alert.present();
  }

  private WarningClearAllProducts() {
    let alert = this.alertCtrl.create({
      title: this.language['ClearAll'],
      message: this.language['WishClearAll'],
      buttons: [
        { text: this.language['Yes'], handler: () => { this.RemoveAllProducts(); } },
        { text: this.language['No'] }
      ]
    });
    alert.present();
  }
  //#endregion

  //#region Modals
  private OpenListPickerModal() {
    Globals.CreateFolderStructure(this.file);

    let listArrayList = new Array<string>();

    this.file.listDir(this.file.externalRootDirectory, Globals.listDir)
      .then(array => array.forEach(line => listArrayList.push(line.name)))
      .catch(array => this.debug.push(this.file.externalRootDirectory + Globals.listDir));
    
    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let listPickerModal: Modal = this.modalController.create(ListPickerModal, { 'item': listArrayList }, modalOptions);

    listPickerModal.present();

    listPickerModal.onDidDismiss((data) => {
      this.ApplyListFileAction(data.action, data.filename);
      // this.debug.push(data.index, data.action); 
    });
  }
  //#endregion

  //#region IO Methods
  private SaveListToFile() {
    Globals.CreateFolderStructure(this.file);
    let alert = this.alertCtrl.create({
      title: this.language['SaveList'],
      inputs: [{ name: 'filename', placeholder: this.language['Filename'] }],
      buttons: [
        { text: this.language['Cancel'] },
        { text: this.language['Save'], handler: data => {
          this.file.writeFile(
            this.file.externalRootDirectory + Globals.listDir,
            (data.filename + ".sav").toLowerCase(), JSON.stringify(this.products),
            {replace: true})
        }}
      ]
    });
    alert.present();
  }

  private LoadListFromFile(filename: string) {
    this.file.readAsText(this.file.externalRootDirectory + Globals.listDir, filename)
      .then(loadedFile => this.products = JSON.parse(loadedFile));
  }

  // Not Yet Implemented
  private DeleteListFile(filename: string) {
    let location = this.file.externalRootDirectory + Globals.listDir;
    this.file.removeFile(location, filename);
  }

  // Not Yet Implemented
  private RenameListFile(oldFilename: string, newFilename: string) {
    let location = this.file.externalRootDirectory + Globals.listDir;
    this.file.moveFile(location, oldFilename, location, newFilename)
      .then(() => this.file.removeFile(location, oldFilename));
  }

  private ApplyListFileAction(action: string, filename: string ){
    switch(action){
      case "load":
        this.LoadListFromFile(filename);
        break;
      case "rename":
        break;
      case "delete":
        this.DeleteListFile(filename);
        break;
    }
  }
  //#endregion
}


