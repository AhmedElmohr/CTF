const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') && !file.includes('_lib\\sessions.ts') && !file.includes('_lib/sessions.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src/app/api/labs'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace getSession(
  if (content.includes('getSession(') && !content.includes('await getSession(')) {
    content = content.replace(/([ \t]*[a-zA-Z0-9_]+[ \t]*=[ \t]*)getSession\(/g, '$1await getSession(');
    changed = true;
  }

  // Replace getSession<Type>(
  if (content.match(/getSession<.*>\(/) && !content.includes('await getSession<')) {
    content = content.replace(/([ \t]*[a-zA-Z0-9_]+[ \t]*=[ \t]*)getSession</g, '$1await getSession<');
    changed = true;
  }

  // Replace setSession(
  if (content.includes('setSession(') && !content.includes('await setSession(')) {
    content = content.replace(/([ \t]*)setSession\(/g, '$1await setSession(');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
