const fs = require('fs');
const path = require('path');
const target = 2147483647; //optimally 2147483647
let last = -1;

const stream = fs.createWriteStream(`./generated_${path.basename(__filename)}`, { flag: 'w+' });
stream.write(`const number = Math.round(Math.random()*${target});\n\nconsole.log(\`Number is \${number}\`);\n\n`);

write(0);
async function write(i) {
	for (; i <= target; i++){
		writePercent(i);
		if (!stream.write(`if (number === ${i}) {\n\tconsole.log('${i % 2 ? 'odd' : 'even'}');\n}${i !== target ? ' else ' : ''}`)){
			stream.once('drain', function() {
				write(i + 1);
			});
			return;
		}
	}
	stream.end();
}

function writePercent(number) {
	let count = Math.floor(((number / target) * 100));
	if (count <= last) return;
	last = count;
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`${count}%`);
}
