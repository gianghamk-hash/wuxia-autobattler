/** Changed portraits get a revision key so returning players see the new scenery immediately. */
export function portraitURL(path){
 const url=new URL('../../'+path,import.meta.url);
 if(/\/companions\/companion_(5[1-9]|60)\.webp$/.test(url.pathname))url.searchParams.set('art','5.1');
 return url.href;
}
