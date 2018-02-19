import { LanguageController, Language } from '../language/language-controller';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

export class IItem {
  Name: string;
  Price: number;
  Quantity: number;
  Discount: number;
  Active: boolean;
}

declare var cordova: any;

@Component({
  selector: 'grocery-list',
  templateUrl: 'grocery-list.component.html'
})
export class GroceryListComponent {
  language: Language;
  items: Array<IItem> = new Array<IItem>();
  totalPrice: number;
  newItemName: string;
  debug: any;
    
  constructor (
    public alertCtrl: AlertController,
    private _changeDetectionRef: ChangeDetectorRef,
    private langController: LanguageController,
    private file: File,
    public platform: Platform)
  {
    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      this.file.listDir(this.file.externalRootDirectory, "Download").then(data=> this.debug = data);
    });
    
      
    // this.file.checkDir(this.file.externalApplicationStorageDirectory, 'mydir')
    //   .then(_ => console.log('Directory exists'))
    //   .catch(err => console.log('Directory doesnt exist: ' + this.file.externalApplicationStorageDirectory));
    this.language = langController.ReturnNewLanguage("pt-pt", "€");
    // this.language = langController.ReturnNewLanguage("eng", "€");
    this.newItemName = this.language.ProductName;
    this.newItemName = this.file.externalApplicationStorageDirectory;
    this.totalPrice = 0;
    // this.items.push({ Name: 'Couves', Price: 1.20, Quantity: 1, Discount: 0, Active: true });
    // this.items.push({ Name: 'Sabonete', Price: 2, Quantity: 2, Discount: 0, Active: true });
    // this.items.push({ Name: 'Caixa Plastico', Price: 8, Quantity: 1, Discount: 0, Active: true });
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
      this.items.push({Name: this.newItemName, Price: 1, Quantity: 1, Discount: 0, Active: true });
    }
    this.newItemName = this.language.ProductName;
    this._changeDetectionRef.detectChanges();
  }

  private WarningDeleteProduct(item) {
    let alert = this.alertCtrl.create({
      title: this.language.DeleteProduct,
      message: this.language.WishDeleteProduct,
      buttons: [
        {
          text: this.language.Yes,
          handler: () => {
            this.DeleteItem(item);
          }
        },
        {
          text: this.language.No
        }
      ]
    });
    alert.present();
  }

  private WarningClearAllProducts() {
    let alert = this.alertCtrl.create({
      title: this.language.ClearAll,
      message: this.language.WishClearAll,
      buttons: [
        {
          text: this.language.Yes,
          handler: () => {
            this.RemoveAllProducts();
          }
        },
        {
          text: this.language.No
        }
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
}
