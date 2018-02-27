import { File } from '@ionic-native/file';
import { IProduct } from './classes';

'use strict';

export const mainDir = "ListItUp/";
export const listDir = "ListItUp/Lists";
export const optionsDir = "ListItUp/Options";

export function CreateFolderStructure(file: File) {
    file.checkDir(file.externalRootDirectory, mainDir)
        .catch(() => file.createDir(file.externalRootDirectory, mainDir, false))
        .then(() => file.checkDir(file.externalRootDirectory, listDir)
            .catch(() => file.createDir(file.externalRootDirectory, listDir, false))
            .then(() => file.checkDir(file.externalRootDirectory, optionsDir)
                .catch(() => file.createDir(file.externalRootDirectory, optionsDir, false)
            )
        )
    );   
}

//#region List Management

export function DeleteListFile(file: File, filename: string) {
    let location = file.externalRootDirectory + listDir;
    file.removeFile(location, filename);
}

export function RenameListFile(file: File, oldFilename: string, newFilename: string) {
    let location = file.externalRootDirectory + listDir;
    if(newFilename != oldFilename) {
      file.moveFile(location, oldFilename, location, newFilename + ".sav")
        .then(() => file.removeFile(location, oldFilename));
    }
}

export function LoadList(file: File, products: Array<IProduct>, filename: string) {
    file.readAsText(this.file.externalRootDirectory + listDir, filename)
        .then(loadedFile => products = JSON.parse(loadedFile));
}

  
export function WriteList(file: File, filename: string) {
    // if(this.CheckValidFilename(filename)) {
    //   let fileFound = false;
    //   this.file.checkFile(this.file.externalRootDirectory + FileManager.listDir, filename + ".sav")
    //     .then((found: boolean) =>  fileFound = found);
  
    //   if(fileFound) {
    //     this.ShowInvalidListNameAlert(this.language['InvalidNameAlreadyExists']);
    //   }
    //   else {
        this.file.writeFile(
          file.externalRootDirectory + listDir,
          (filename + ".sav").toLowerCase(), JSON.stringify(this.products),
          {replace: true})  // Unnecessary but still here if file is rostored before check
    //   }
    // }
}

export function LoadListsToArray(file: File): Array<string> {
    let listArrayList = new Array<string>();

    this.file.listDir(file.externalRootDirectory, listDir)
      .then(array => array.forEach(line => listArrayList.push(line.name)))
      .catch(error => console.log(error));
    return listArrayList;
}
//#endregion