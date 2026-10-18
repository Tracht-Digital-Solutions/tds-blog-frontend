import raw from './imageCatalog.json';
type Lang='de'|'en';
interface Asset {src:string;width:number;height:number;alt:Record<Lang,string>;variants:{src:string;width:number;height:number;hash:string;bytes:number}[];digitalSourceType:string}
const assets=Object.values(raw) as Asset[];
const origin='https://tracht-digital.de';
export function imageInfo(src?:string|null):Asset|undefined {
  if(!src)return undefined;
  try {const url=new URL(src,origin);if(url.origin!==origin)return undefined;return assets.find(a=>a.src===url.pathname||a.variants.some(v=>v.src===url.pathname));}catch{return undefined;}
}
export function imageHints(src:string|null|undefined,lang:Lang,sizes='100vw') {
  const image=imageInfo(src);if(!image)return undefined;
  return {alt:image.alt[lang],width:image.width,height:image.height,srcSet:image.variants.map(v=>`${origin}${v.src}?v=${v.hash} ${v.width}w`).join(', '),sizes,decoding:'async' as const};
}
export function imageObject(src:string|null|undefined,lang:Lang,pageUrl:string) {
  const image=imageInfo(src);if(!image)return null;
  return {'@type':'ImageObject','@id':pageUrl+'#editorial-image',contentUrl:origin+image.src,url:origin+image.src,caption:image.alt[lang],width:image.width,height:image.height,encodingFormat:'image/webp',digitalSourceType:image.digitalSourceType,creditText:'Tracht Digital Solutions',about:{'@id':pageUrl}};
}
