import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';


export async function loadSaved( path = new URL("../saved.json", import.meta.url )) {
    const plain = await readFile(path,"utf8");
    return JSON.parse(plain);
}

export async function saveJob(id , path = new URL("../saved.json", import.meta.url ) ) {
    const saved = await loadSaved(path);
   
    if(!saved.includes(id))
    {
      saved.push(id);
    }
    
    const serialized = JSON.stringify(saved);
    await writeFile(path, serialized);

    return saved;
}    

export async function removeSaved(id , path = new URL("../saved.json", import.meta.url ))
{
    const there = await loadSaved(path);
     const index = there.indexOf(id);
    if(index !== -1)
    {
    
        there.splice(index , 1);
    }
    
    const fixed = JSON.stringify(there);
    await writeFile(path , fixed);
    return there;

}
