import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController } from 'ionic-angular';

export class IItem {
  Name: string;
  Price: number;
  Quantity: number;
  Discount: number;
  Active: boolean;
}

@Component({
  selector: 'lista-compras',
  templateUrl: 'lista-compras.html'
})
export class ListaCompras {
  items: Array<IItem> = new Array<IItem>();
  totalPrice: number = 0;
  newItemName: string = 'Sem Nome';
    
  constructor(public alertCtrl: AlertController, private _changeDetectionRef: ChangeDetectorRef) {
    // this.items.push({ Name: 'Couves', Price: 1.20, Quantity: 1, Discount: 0, Active: true });
    // this.items.push({ Name: 'Sabonete', Price: 2, Quantity: 2, Discount: 0, Active: true });
    // this.items.push({ Name: 'Caixa Plastico', Price: 8, Quantity: 1, Discount: 0, Active: true });
    this.UpdateList();
  }

  public AddNewItem() {
    let foundItem = this.items.find(item => item.Name == this.newItemName);
    if(foundItem) {
      let check = this.newItemName.length > 0;
      let alert = this.alertCtrl.create(
        {
          title: 'Nome Inválido!',
          subTitle: check ? 'Lamentamos, mas o nome que inseriu já existe!' : 'Por favor, insira um nome',
          buttons: ['OK']});
      alert.present();
    }
    else {
      this.items.push({Name: this.newItemName, Price: 1, Quantity: 1, Discount: 0, Active: true });
    }
    this.newItemName = 'Sem Nome';
    this.UpdateList();
    this._changeDetectionRef.detectChanges();
  }

  private WarningDeleteProduct(item) {
    let alert = this.alertCtrl.create({
      title: 'Eliminar Produto',
      message: 'Deseja mesmo apagar este produto?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.DeleteItem(item);
          }
        },
        {
          text: 'Não',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  private WarningClearAllProducts() {
    let alert = this.alertCtrl.create({
      title: 'Limpar Tudo',
      message: 'Deseja mesmo limpar todos os produtos?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.RemoveAllProducts();
          }
        },
        {
          text: 'Não',
          role: 'cancel',
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
