import { IProduct } from './classes';

export function CompareStrings(a: IProduct, b: IProduct) {
    if (a.Name.toLocaleLowerCase() < b.Name.toLocaleLowerCase()) return -1;
    if (a.Name.toLocaleLowerCase() > b.Name.toLocaleLowerCase()) return 1;
    return 0;
}