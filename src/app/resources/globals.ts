import { IProduct } from './classes';
import { File } from '@ionic-native/file';

'use strict';

export const mainDir = "ListItUp/";
export const listDir = "ListItUp/Lists";
export const optionsDir = "ListItUp/Options";

export function CompareStrings(a: IProduct, b: IProduct) {
    if (a.Name.toLocaleLowerCase() < b.Name.toLocaleLowerCase()) return -1;
    if (a.Name.toLocaleLowerCase() > b.Name.toLocaleLowerCase()) return 1;
    return 0;
}

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