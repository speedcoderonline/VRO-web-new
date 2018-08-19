const express = require('express')
const firebase = require('firebase')
const admin = require('firebase-admin')
const app = express()
const router = express.Router()

//Join Interest Group
router.get('/interestGroups/addMember/:group/:userInfo', addGroupMember)
function addGroupMember(req, res, next){
	const params = req.params
	const group = params.group
	const userInfo = JSON.parse(params.userInfo)
	const name = userInfo.name
	const email = userInfo.email
	const fixedEmail = email.replace(/\./g, '%2E')

	admin.database().ref('structure/interest-groups/' + group + '/members/' + fixedEmail).set({
		name: name,
		email: email
	}).then(function(){
		console.log('success')
		res.send(true)
		next()
	})
}

//Leave Interest Group
router.get('/interestGroups/removeMember/:group/:user', removeGroupMember)
function removeGroupMember(req, res, next){
	const params = req.params
	const group = params.group
	const user = params.user
	const fixedUser = user.replace(/\./g, '%2E')
	admin.database().ref('structure/interest-groups/' + group + '/members/' + fixedUser).remove().then(function(){
		console.log('success')
		res.send(true)
		next()
	})
}

module.exports = router