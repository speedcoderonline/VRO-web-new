const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')

const app = express()

router.post('/interest-groups/create-group', createGroup)
function createGroup(req, res, next){
	const body = req.body
	const name = body.groupName
	const description = body.groupDesc
	const president = body.groupPresident
	const color = body.colorChoice
	console.log(body)

	const pathName = name.toLowerCase().replace(/\ /g, '-').replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')

	res.redirect('/success')

	admin.database().ref('structure/interest-groups/' + pathName).set({
		name: name,
		description: description,
		president: president,
		color: color
	}).then(function(){
		console.log('Group created: ' + name)
		next()
	})
}

router.post('/admin/add-student', addStudent)
function addStudent(req, res, next){
	const body = req.body
}

module.exports = router