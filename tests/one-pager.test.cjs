const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));
function boot({loadFails=false, copyFails=false, fallback=false}={}) {
  const nodes = Object.fromEntries(['one-pager-prompt','copy-one-pager','prompt-status','prompt-details','print-example'].map(id => [id,{value:'',disabled:id==='copy-one-pager',textContent:'',open:false,focus(){},select(){this.selected=true;},addEventListener(_,fn){this.click=fn;}}]));
  const copies = [];
  vm.runInNewContext(read('assets/one-pager-ui.js'), {
    document:{querySelector:s=>nodes[s.slice(1)],execCommand:()=>fallback},
    window:{print(){}},
    navigator:{clipboard:{async writeText(value){if(copyFails) throw Error('denied'); copies.push(value);}}},
    fetch:async()=>({ok:!loadFails,text:async()=>read('prompts/one-pager.md')})
  });
  return {nodes,copies};
}
test('one-pager copies the canonical prompt and respects user edits', async()=>{
  const {nodes,copies}=boot(); await tick();
  assert.equal(nodes['one-pager-prompt'].value,read('prompts/one-pager.md'));
  assert.equal(nodes['copy-one-pager'].disabled,false);
  nodes['one-pager-prompt'].value += '\nAudience: new AE';
  await nodes['copy-one-pager'].click();
  assert.equal(copies[0],nodes['one-pager-prompt'].value);
});
test('clipboard denial reveals selected text and failed loading does not enable copy', async()=>{
  const failed=boot({copyFails:true}); await tick(); await failed.nodes['copy-one-pager'].click();
  assert.equal(failed.nodes['prompt-details'].open,true);
  assert.equal(failed.nodes['one-pager-prompt'].selected,true);
  assert.match(failed.nodes['prompt-status'].textContent,/Copy is blocked/);
  const fallback=boot({copyFails:true,fallback:true}); await tick(); await fallback.nodes['copy-one-pager'].click();
  assert.match(fallback.nodes['prompt-status'].textContent,/Copied/);
  const unloaded=boot({loadFails:true}); await tick();
  assert.equal(unloaded.nodes['copy-one-pager'].disabled,true);
  assert.match(unloaded.nodes['prompt-status'].textContent,/could not load/);
});
test('public routes resolve and illustration carries its own printable disclosure',()=>{
  const page=read('one-pager/index.html');
  for(const [,link] of page.matchAll(/(?:src|href)="(\/(?:assets|prompts|examples)\/[^"#]+)"/g)) assert.ok(fs.existsSync(path.join(__dirname,'..',link)),link);
  assert.ok(read('index.html').includes('href="/one-pager/"'));
  assert.ok(read('sitemap.xml').includes('https://sellercontext.com/one-pager/'));
  const sheet=page.slice(page.indexOf('<article class="sheet"'),page.indexOf('</article>'));
  assert.match(sheet,/ILLUSTRATIVE CONCEPT/);
  assert.match(sheet,/current availability is not verified/);
  assert.doesNotMatch(page,/\/Users\/|Wyra|Tripalti|Tipalti/);
});
