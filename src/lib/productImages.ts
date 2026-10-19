import catalog from './productImages.json';
import type {ShopProductRef as CatalogProduct} from "@tracht-digital-solutions/tds-shared/schemas";
type Lang='de'|'en';

interface ProductImage {slug:string;slugs:Record<Lang,string>;title:Record<Lang,string>;alt:Record<Lang,string>;width:number;height:number;src:string;digitalSourceType:string}
export const productImageCatalog = catalog as Record<string,ProductImage>;
export const productImage = (slug:string):ProductImage|undefined => productImageCatalog[slug];
const origin='https://shop.tracht-digital.de';
export function withProductImage<T extends Pick<CatalogProduct,'slug'|'offers'|'imageUrl'>>(product:T):T {
  const image=productImage(product.slug);
  const own=product.offers.some(o=>o.kind==='own');
  const existing=product.imageUrl;
  // Explicit service artwork replaces legacy generic grounds, while a new CMS upload wins.
  const generic=!existing || /^https:\/\/tracht-digital\.de\/images\/services\//.test(existing);
  return image && own && generic ? {...product,imageUrl:origin+image.src} : product;
}
export function productImageAttributes(product:Pick<CatalogProduct,'slug'|'imageUrl'>,lang:Lang,detail=false) {
  const image=productImage(product.slug);
  if(!image || product.imageUrl!==origin+image.src)return undefined;
  return {alt:image.alt[lang],width:image.width,height:image.height,
    srcSet:productImageSrcset(image.src),sizes:detail?'(min-width: 64rem) 60vw, 100vw':'(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw',
    loading:detail?'eager' as const:'lazy' as const,decoding:'async' as const};
}
export function productImageSrcset(src:string,format='webp'):string {
  return [480,960,1440].map(w=>`${origin}${src.replace('.webp',(w===1440?'':'-'+w)+'.'+format)} ${w}w`).join(', ');
}
