'use strict'

const {postalCodeShapes} = require('deutsche-post')
const Queue = require('queue')
const uniq = require('lodash.uniq')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const fetchPostalCodes = (prefix) => {
	return postalCodeShapes(`code like '${prefix}%'`)
	.then((collection) => collection.features.map((f) => f.properties.code))
}



const queue = Queue({
	concurrency: 8,
	timeout: 60 * 1000,
	autostart: true
})
let codes = []

queue
.on('error', showError)
.on('end', () => {
	const data = JSON.stringify(uniq(codes).sort())
	process.stdout.write(data)
})

for (let i = 0; i <= 999; i++) {
	const prefix = ('00' + i).slice(-3)

	;((prefix) => {
		queue.push((cb) => {
			fetchPostalCodes(prefix)
			.then((newCodes) => {
				codes = codes.concat(newCodes)
				process.stderr.write(prefix + '* ✓\n')
				cb()
			})
			.catch(cb)
		})
	})(prefix)
}
