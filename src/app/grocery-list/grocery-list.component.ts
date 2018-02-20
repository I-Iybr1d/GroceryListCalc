import { LanguageController, Language } from '../language/language-controller';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, Platform, ModalOptions, Modal, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import * as Globals from '../resources/globals';
import { ListPickModal } from '../list-picker/list-picker-modal';

export class IItem {
  Name: string;
  Price: number;
  Quantity: number;
  Discount: number;
  Active: boolean;
}

@Component({
  selector: 'grocery-list',
  templateUrl: 'grocery-list.component.html'
})
export class GroceryListComponent {
  language: Language;
  items: Array<IItem> = new Array<IItem>();
  totalPrice: number;
  newItemName: string;
  debug: Array<string> = new Array<string>();
    
  constructor (
    public alertCtrl: AlertController,
    private _changeDetectionRef: ChangeDetectorRef,
    private langController: LanguageController,
    private file: File,
    private modalController: ModalController,
    private platform: Platform)
  {
    this.language = langController.ReturnNewLanguage("pt-pt", "€");
    // this.language = langController.ReturnNewLanguage("eng", "€");
    this.newItemName = this.language.ProductName;
    this.platform.ready().then(() => {

    });

    this.totalPrice = 0;
    this.UpdateList();
  }

  public AddNewItem() {
    let foundItem = this.items.find(item => item.Name == this.newItemName);
    if(foundItem) {
      let checkNameSize = this.newItemName.length > 0;
      let alert = this.alertCtrl.create(
        {
          title: this.language.InvalidName,
          subTitle: checkNameSize ? this.language.InvalidNameAlreadyExists : this.language.InvalidNamePleaseInsert,
          buttons: ['OK']});
      alert.present();
    }
    else {
      this.items.reverse().push({Name: this.newItemName, Price: 1, Quantity: 1, Discount: 0, Active: true });
      this.items.reverse();
    }
    this.newItemName = this.language.ProductName;
    this._changeDetectionRef.detectChanges();
  }

  private WarningDeleteProduct(item) {
    let alert = this.alertCtrl.create({
      title: this.language.DeleteProduct,
      message: this.language.WishDeleteProduct,
      buttons: [
        { text: this.language.Yes, handler: () => { this.DeleteItem(item); } },
        { text: this.language.No }
      ]
    });
    alert.present();
  }

  private WarningClearAllProducts() {
    let alert = this.alertCtrl.create({
      title: this.language.ClearAll,
      message: this.language.WishClearAll,
      buttons: [
        { text: this.language.Yes, handler: () => { this.RemoveAllProducts(); } },
        { text: this.language.No }
      ]
    });
    alert.present();
  }

  public DeleteItem(currentItem) {
    this.items = this.items.filter(item => item !== currentItem);
    this.UpdateList();
  }

  public RemoveAllProducts(){
    this.items = new Array<IItem>();
    this.UpdateList();
  }

  // Private Methods
  private CompareItemNames(a: IItem, b: IItem) {
    if (a.Name.toLocaleLowerCase() < b.Name.toLocaleLowerCase()) return -1;
    if (a.Name.toLocaleLowerCase() > b.Name.toLocaleLowerCase()) return 1;
    return 0;
  }

  private UpdateList() {
    this.items.sort(this.CompareItemNames);
    this.totalPrice = this.CalculateTotalPrice(this.items);
  }

  private CalculatePrice(item: IItem): number {
    return (item.Price * item.Quantity) * (1 - item.Discount * 0.01)
  }

  private CalculateTotalPrice(items: Array<IItem>): number {
    let total = 0;
    for (let item of this.items) {
      if(item.Active) {
        total += (item.Price * item.Quantity) * (1 - item.Discount * 0.01);
      }
    }
    return total;
  }

  private SaveListToFile() {
    this.CreateFolderStructure();
    let alert = this.alertCtrl.create({
      title: this.language.SaveList,
      inputs: [{ name: Globals.Filename, placeholder: this.language.Filename }],
      buttons: [
        { text: this.language.Cancel },
        { text: this.language.Save, handler: data => {
          this.file.writeFile(
            this.file.externalRootDirectory + Globals.RelativePathListFolder,
            (data.filename + ".sav").toLowerCase(), JSON.stringify(this.items),
            {replace: true})
        }}
      ]
    });
    alert.present();
  }

  private LoadListFromFile() {
    this.CreateFolderStructure();
    let alert = this.alertCtrl.create({
      title: this.language.LoadList,
      inputs: [{ name: Globals.Filename, placeholder: this.language.Filename }],
      buttons: [
        { text: this.language.Cancel },
        { text: this.language.Save, handler: data => {
          this.file.writeFile(
            this.file.externalRootDirectory + Globals.RelativePathListFolder,
            (data.filename + ".sav").toLowerCase(), JSON.stringify(this.items),
            {replace: true})
        }}
      ]
    });
    alert.present();
  }

  private CreateFolderStructure() {
    this.file.checkDir(this.file.externalRootDirectory, Globals.AppName)
      .catch(() => this.file.createDir(this.file.externalRootDirectory, Globals.AppName, false));
    this.file.checkDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameListsFolder)
      .catch(() => this.file.createDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameListsFolder, false));
    this.file.checkDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameLanguagesFolder)
      .catch(() => this.file.createDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameLanguagesFolder, false));
    this.file.checkDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameOptionsFolder)
      .catch(() => this.file.createDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameOptionsFolder, false));
  }

  private OpenListPickerModal() {
    let listArrayList = new Array<string>();

    this.file.listDir(this.file.externalRootDirectory + Globals.AppName, Globals.NameListsFolder)
      .then(array => array.forEach(line => listArrayList.concat([line.name])));

    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let listPickerModal: Modal = this.modalController.create(ListPickModal, {item: listArrayList}, modalOptions);

    listPickerModal.onDidDismiss((data) => {
      console.log(data.action);
      console.log(data.index);
    });

    listPickerModal.present();
  }
}


