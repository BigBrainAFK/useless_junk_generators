const fs = require('fs');
const path = require('path');
const target = 2147483647; //optimally 2147483647
let last = -1;

const stream = fs.createWriteStream(`./generated_${path.basename(__filename)}`, { flag: 'w+' });
stream.write(`const number = Math.round(Math.random()*${target});\n\nconsole.log(\`Number is \${number}\`);\n\n`);

write(0);
async function write(i) {
	for (; i <= target; i++){
		await writePercent(i);
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
	let count = Math.floor(((number / target) * 100) / 10);
	if (count <= last) {
		process.stdout.cursorTo(14);
		process.stdout.write(`${' '.repeat(target.toString().length - number.toString().length)}${number}/${target}`);
		return;
	}
	last = count;
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`[${'='.repeat(count < 10 ? count > 1 ? count - 1 : 0 : count)}${count < 10 ? '>' : ''}${' '.repeat(count < 10 ? count === 0 ? 9: 10 - count : 0)}]`);
}
