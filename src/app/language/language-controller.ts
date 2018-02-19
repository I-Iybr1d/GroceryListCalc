import { Injectable } from '@angular/core';

@Injectable()
export class LanguageController {
    public ReturnNewLanguage(lang: string, currency: string) {
        let newLanguage = new Language();
        switch(lang) {
            case "pt-pt":
                newLanguage.GroceryList = "Lista de Compras";
                newLanguage.Product = "Produto",
                newLanguage.AddProduct = "Adicionar Produto";
                newLanguage.ProductName = "Nome Produto";
                newLanguage.Total = "Total";
                newLanguage.ClearAll = "Limpar Tudo";
                newLanguage.Price = "Preço";
                newLanguage.Quantity = "Quantidade";
                newLanguage.Discount = "Desconto";
                newLanguage.Active = "Activo";
                newLanguage.Inactive = "Inactivo";
                newLanguage.Delete = "Apagar";
                newLanguage.InvalidName = "Nome Inválido!";
                newLanguage.InvalidNameAlreadyExists = "Lamentamos, mas o nome que inseriu já existe!";
                newLanguage.InvalidNamePleaseInsert = "Por favor, insira um nome";
                newLanguage.DeleteProduct = "Apagar Produto";
                newLanguage.WishDeleteProduct = "Deseja apagar este produto?";
                newLanguage.Yes = "Sim";
                newLanguage.No = "Não";
                newLanguage.WishClearAll = "Deseja limpar todos os produtos?";
                newLanguage.Currency = currency;
                break;
            case "eng":
            default:
                newLanguage.GroceryList = "Grocery List";
                newLanguage.Product = "Product",
                newLanguage.AddProduct = "Add Product";
                newLanguage.ProductName = "Product Name";
                newLanguage.Total = "Total";
                newLanguage.ClearAll = "Clear All";
                newLanguage.Price = "Price";
                newLanguage.Quantity = "Quantity";
                newLanguage.Discount = "Discount";
                newLanguage.Active = "Active";
                newLanguage.Inactive = "Inactive";
                newLanguage.Delete = "Delete";
                newLanguage.InvalidName = "Invalid Name!";
                newLanguage.InvalidNameAlreadyExists = "Sorry, but the selected name already exists!";
                newLanguage.InvalidNamePleaseInsert = "Please insert a name";
                newLanguage.DeleteProduct = "Delete Product";
                newLanguage.WishDeleteProduct = "Do you wish to delete this product?";
                newLanguage.Yes = "Yes";
                newLanguage.No = "No";
                newLanguage.WishClearAll = "Do you wish to clear all products?";
                newLanguage.Currency = currency;
                break;
        }
        return newLanguage;
    }
}

export class Language {
    public GroceryList: string;
    public Product: string;
    public AddProduct: string;
    public ProductName: string;
    public Total: string;
    public ClearAll: string;
    public Price: string;
    public Quantity: string;
    public Discount: string;
    public Active: string;
    public Inactive: string;
    public Delete: string;
    public InvalidName: string;
    public InvalidNameAlreadyExists: string;
    public InvalidNamePleaseInsert: string;
    public DeleteProduct: string;
    public WishDeleteProduct: string;
    public Yes: string;
    public No: string;
    public WishClearAll: string;
    public Currency: string;
    public PercentageSymbol: string = "%";
}