'use strict'

const test = require('tape')
const uniq = require('lodash.uniq')

const codes = require('.')

test('codes should be in a sorted array', (t) => {
	t.plan(2)

	t.ok(Array.isArray(codes))
	t.deepEqual(codes, codes.sort())
})

test('codes should be unique', (t) => {
	t.plan(1)

	t.deepEqual(codes, uniq(codes))
})

test('codes should look like valid PLZs', (t) => {
	t.plan(codes.length)
	const validPLZ = /^\d{5}$/

	for (let code of codes) {
		t.ok(validPLZ.test(code), code + ' is invalid')
	}
})

test('there should be more than 5k codes', (t) => {
	t.plan(1)

	t.ok(codes.length > 5000, `only ${codes.length} codes`)
})
