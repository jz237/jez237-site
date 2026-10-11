import {pathToFileURL} from 'node:url';
export async function checkHiddenReefImages(base, fetcher=fetch) {
 for (const name of ['hidden-reef','hidden-reef-header-preview']) {
  const url=new URL(`/prototypes/${name}/category/?cat=saltwater`,base);
  const response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  if(response.status!==302 || response.headers.get('location')!=='https://hidden-reef.pages.dev/category/?cat=saltwater')throw Error(`Hidden Reef redirect missing: ${url}`);
  await response.body?.cancel();
 }
 console.log('Hidden Reef legacy links point to the standalone Cloudflare site.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await checkHiddenReefImages(process.argv[2]||'https://jez237.com');
