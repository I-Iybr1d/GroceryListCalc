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
  //#region Variables
  //#region Service Variables
  language = new Array<string>();
  private languageListener: Subscription;
  debug: Array<string> = new Array<string>();
  //#endregion 

  //#region Data Variables
  products: Array<IProduct> = new Array<IProduct>();
  totalPrice: number;
  //#endregion
  //#endregion

  //#region Hook Cyles
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

  private ApplyListFileAction(action: string, filename: string ){
    switch(action){
      case "load": this.LoadListFromFile(filename); break;
      case "rename": this.ShowRenameListAlert(filename); break;
      case "delete": this.DeleteListFile(filename); break;
    }
  }

  public CheckValidFilename(filename: string): boolean {
    if(filename.length < 4) {
      this.ShowInvalidListNameAlert(this.language["InvalidNameTooShort"]);
      return false;
    }

    const regex = new RegExp('^[a-zA-Z0-9_.-]*$');
    if(regex.test(filename)) {
      return true;
    }
    this.ShowInvalidListNameAlert(this.language['InvalidNamePleaseInsert']);
    return false;

  }
  //#endregion

  //#region Alerts

  public ShowInvalidListNameAlert(warning: string)
  {
    let alert = this.alertCtrl.create({
      title: this.language['InvalidName'],
      message: warning,
      buttons: ['OK']
    });
    alert.present();
  }
  private SaveListToFile() {
    Globals.CreateFolderStructure(this.file);
    let alert = this.alertCtrl.create({
      title: this.language['SaveList'],
      inputs: [{ name: 'filename', placeholder: this.language['Filename'] }],
      buttons: [
        { text: this.language['Cancel'] },
        { text: this.language['Save'], handler: data => {
          this.WriteListFile(data.filename);
        }}
      ]
    });
    alert.present();
  }

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

  private ShowRenameListAlert(oldFilename: string){
    let alert = this.alertCtrl.create({
      title: this.language['Rename'],
      message: this.language['ChoseNewListName'],
      inputs: [{ name: 'listname', placeholder: this.language['ListName'] }],
      buttons: [
        { text: this.language['Cancel'] },
        { text: this.language['Save'], handler: data => { this.RenameListFile(oldFilename, data.listname); }}
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
    });
  }
  //#endregion

  //#region IO Methods
  private LoadListFromFile(filename: string) {
    this.file.readAsText(this.file.externalRootDirectory + Globals.listDir, filename)
      .then(loadedFile => this.products = JSON.parse(loadedFile));
  }

  private WriteListFile(filename: string) {
    // if(this.CheckValidFilename(filename)) {
    //   let fileFound = false;
    //   this.file.checkFile(this.file.externalRootDirectory + Globals.listDir, filename + ".sav")
    //     .then((found: boolean) =>  fileFound = found);
  
    //   if(fileFound) {
    //     this.ShowInvalidListNameAlert(this.language['InvalidNameAlreadyExists']);
    //   }
    //   else {
        this.file.writeFile(
          this.file.externalRootDirectory + Globals.listDir,
          (filename + ".sav").toLowerCase(), JSON.stringify(this.products),
          {replace: true})  // Unnecessary but still here if file is rostored before check
    //   }
    // }
  }

  private RenameListFile(oldFilename: string, newFilename: string) {
    let location = this.file.externalRootDirectory + Globals.listDir;
    if(newFilename != oldFilename) {
      this.file.moveFile(location, oldFilename, location, newFilename + ".sav")
      .then(() => this.file.removeFile(location, oldFilename));
    }
  }

  private DeleteListFile(filename: string) {
    let location = this.file.externalRootDirectory + Globals.listDir;
    this.file.removeFile(location, filename);
  }
  //#endregion

}


