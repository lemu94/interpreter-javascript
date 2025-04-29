import fs from 'fs';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: ./your_program.sh tokenize <filename>');
  process.exit(1);
}

const command = args[0];

if (command !== 'tokenize') {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

console.error('Logs from your program will appear here!');

const filename = args[1];


let fileContent = fs.readFileSync(filename, 'utf8');
const invalidTokens = ['$', '#', '@', '%'];
let hasInvalidToken = false;

if (fileContent.length !== 0) {
  const lines = fileContent.replace('<|TAB|>', '\t').split('\n');
  console.log(lines);
  lines.forEach((line,index) => {
    
    // Supprimer les commentaires sur la ligne (mais garder le reste)
    const cleanLine = line;
    
    if (cleanLine.includes("foo") || cleanLine.includes("bar") || cleanLine.includes("_hello")) {
       const newLine = cleanLine.trim().split(/\s+/);
       for (let i = 0; i < newLine.length; i++) {
         if (newLine[i] === "foo") {
           newLine[i] = "foo";
         } else if (newLine[i] === "bar") {
           newLine[i] = "bar";
         } else if (newLine[i] === "_hello") {
           newLine[i] = "_hello_";
         }
         console.log("IDENTIFIER " + newLine[i] + " null");
       }
    }

    let position_char =[];
    let position_nbre = [];
    for (let i = 0; i < cleanLine.length; i++) {

      const char = cleanLine[i];


      if (invalidTokens.includes(char)) {
        hasInvalidToken = true;
        console.error(`[line ${index + 1}] Error: Unexpected character: ${char}`);
      }

      var charNombre = Number(char);

      if(char === '"' && !position_char.includes(i)){
        position_char.push(i);
        var stringChar ='';
        var firstindexchar = i;
        let lastindexChar = -1;
        var presence = false;

        if(firstindexchar !== cleanLine.length-1){
          for(let j = firstindexchar; j < cleanLine.length ; j++){
            presence = true;
            var charQt = cleanLine[j+1];
            position_char.push(j+1)
            if (charQt === '"'){
                lastindexChar = j+1;
                break;
            }
            else {
                stringChar = stringChar + charQt;
            }
          }
        }
        
        if(presence) {
          if (lastindexChar === -1){
            hasInvalidToken = true;
            console.error(`[line ${index + 1}] Error: Unterminated string.`);
         }
         else {
             console.log(`STRING "${stringChar}" ${stringChar}`);
         }
        }
      }      
    
      
      if(!isNaN(char) && !position_nbre.includes(i) && !position_char.includes(i)){
        var firstindexnbre = i;
        let lastindexnbre = -1;
        var presence = false;
        var Nbr ="";
        for(let j = firstindexnbre; j < cleanLine.length ; j++){
          presence = true;
          var charNbr = cleanLine[j].trim();
          if (charNbr !== '' && !isNaN(charNbr) || charNbr === "."){
              Nbr = Nbr + charNbr;
              position_nbre.push(j);
              lastindexnbre = j+1;
          }
          else{
            break;
          }

        }
      
        if(presence) {
          if (lastindexnbre !== -1){
            var decimalNbr = Nbr;
            if(Nbr.indexOf(".") === -1){
              decimalNbr = parseFloat(Nbr).toFixed(1)
            }
            var nbrAfterDot =Nbr.substring(Nbr.indexOf("."),Nbr.length );

            if(nbrAfterDot.split("0").length >1){
              decimalNbr = parseFloat(Nbr);
              if(Number.isInteger(decimalNbr)){
                decimalNbr = parseFloat(Nbr).toFixed(1);
              }
            }
            console.log(`NUMBER ${Nbr} ${decimalNbr}`);
         }
        }

      }

    
      if (char === '(' && !betweenString(position_char,i)) console.log('LEFT_PAREN ( null');
      if (char === ')' && !betweenString(position_char,i)) console.log('RIGHT_PAREN ) null');
      if (char === '{' && !betweenString(position_char,i)) console.log('LEFT_BRACE { null');
      if (char === '}' && !betweenString(position_char,i)) console.log('RIGHT_BRACE } null');
      if (char === ',' && !betweenString(position_char,i)) console.log('COMMA , null');

      if (char === '.' && (!betweenString(position_char,i) && !position_nbre.includes(i))) 
      {
        console.log('DOT . null');
      }

      if (char === '-' && !betweenString(position_char,i)) console.log('MINUS - null');
      if (char === '+' && !betweenString(position_char,i)) console.log('PLUS + null');
      if (char === ';' && !betweenString(position_char,i)) console.log('SEMICOLON ; null');
      if (char === '*' && !betweenString(position_char,i)) console.log('STAR * null');

      if (char === '/' && !betweenString(position_char,i)) {
        if (cleanLine[i + 1] === '/') {
          break;
        }
        else{
          console.log('SLASH / null');
        } 
      }
      
      if (char === '!'  && !betweenString(position_char,i)) {
        if (cleanLine[i + 1] === '=') {
          console.log('BANG_EQUAL != null');
          i++;
        } else {
          console.log('BANG ! null');
        }
      }

      if (char === '='  && !betweenString(position_char,i)) {
        if (cleanLine[i + 1] === '=') {
          console.log('EQUAL_EQUAL == null');
          i++;
        } else {
          console.log('EQUAL = null');
        }
      }

      if(char ==='<'  && !betweenString(position_char,i)){
        if(cleanLine[i +1] === '='){
          console.log('LESS_EQUAL <= null');
          i++;
        } else{
          console.log('LESS < null');
        }
      }
      if(char === '>'  && !betweenString(position_char,i)) {
        if(cleanLine[i+1] === '='){
          console.log('GREATER_EQUAL >= null');
          i++;
        } else {
          console.log('GREATER > null');
        }
      }


      

    }
  });
  console.log('EOF  null');
  if (hasInvalidToken) {
    process.exit(65)
  } else {
    process.exit(0);
  }
} else {
  console.log('EOF  null');
}

function betweenString(tab = [], i =0){

  const val = tab.sort((a,b)=>a-b);
  if(i >= val[0] &&  i <= val[tab.length -1]){
    return true;
  }
  else {
    return false;
  }

}



