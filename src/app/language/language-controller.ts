import { Injectable } from '@angular/core';

@Injectable()
export class LanguageController {
    public ReturnNewLanguage(lang: string, currency: string) {
        let newLanguage = new Language();
        switch(lang) {
            case "pt-pt":
                newLanguage.Active = "Activo";
                newLanguage.AddProduct = "Adicionar Produto"; 
                newLanguage.ClearAll = "Limpar Tudo";
                newLanguage.Cancel = "Cancelar";
                newLanguage.Currency = currency;
                newLanguage.Delete = "Apagar";
                newLanguage.DeleteProduct = "Apagar Produto";
                newLanguage.Discount = "Desconto";
                newLanguage.Filename = "Nome de Ficheiro";
                newLanguage.GroceryList = "Lista de Compras";
                newLanguage.Inactive = "Inactivo";
                newLanguage.InvalidName = "Nome Inválido!";
                newLanguage.InvalidNameAlreadyExists = "Lamentamos, mas o nome que inseriu já existe!";
                newLanguage.InvalidNamePleaseInsert = "Por favor, insira um nome válido";
                newLanguage.LoadList = "Carregar Lista";
                newLanguage.No = "Não";
                newLanguage.Price = "Preço";
                newLanguage.Product = "Produto",
                newLanguage.ProductName = "Nome Produto";
                newLanguage.Quantity = "Quantidade";
                newLanguage.Save = "Guardar";
                newLanguage.SaveList = "Guardar Lista";
                newLanguage.Total = "Total";
                newLanguage.WishClearAll = "Deseja limpar todos os produtos?";
                newLanguage.WishDeleteProduct = "Deseja apagar este produto?";
                newLanguage.Yes = "Sim";
                break;
            case "eng":
            default:
                newLanguage.Active = "Active";
                newLanguage.AddProduct = "Add Product";
                newLanguage.Cancel = "Cancel";
                newLanguage.ClearAll = "Clear All";
                newLanguage.Currency = currency;
                newLanguage.Delete = "Delete";
                newLanguage.DeleteProduct = "Delete Product";
                newLanguage.Discount = "Discount";
                newLanguage.Filename = "Filename";
                newLanguage.GroceryList = "Grocery List";
                newLanguage.Inactive = "Inactive";
                newLanguage.InvalidName = "Invalid Name!";
                newLanguage.InvalidNameAlreadyExists = "Sorry, but the selected name already exists!";
                newLanguage.InvalidNamePleaseInsert = "Please insert a valid name";
                newLanguage.LoadList = "LoadList";
                newLanguage.No = "No";
                newLanguage.Price = "Price";
                newLanguage.Product = "Product",
                newLanguage.ProductName = "Product Name";
                newLanguage.Quantity = "Quantity";
                newLanguage.Save = "Save";
                newLanguage.SaveList = "Save List";
                newLanguage.Total = "Total";
                newLanguage.WishClearAll = "Do you wish to clear all products?";
                newLanguage.WishDeleteProduct = "Do you wish to delete this product?";
                newLanguage.Yes = "Yes";
                break;
        }
        return newLanguage;
    }
}

export class Language {
    public Active: string;
    public AddProduct: string;
    public Cancel: string;
    public ClearAll: string;
    public Currency: string;
    public Delete: string;
    public DeleteProduct: string;
    public Discount: string;
    public Filename: string;
    public GroceryList: string;
    public Inactive: string;
    public InvalidName: string;
    public InvalidNameAlreadyExists: string;
    public InvalidNamePleaseInsert: string;
    public LoadList: string;
    public No: string;
    public PercentageSymbol: string = "%";
    public Price: string;
    public Product: string;
    public ProductName: string;
    public Quantity: string;
    public Save: string;
    public SaveList: string;
    public Total: string;
    public WishClearAll: string;
    public WishDeleteProduct: string;
    public Yes: string;
}