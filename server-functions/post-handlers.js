const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const csvToJson = require('convert-csv-to-json')
const async = require('async')
const multer  = require('multer')
let fs = require('fs-extra')

let upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			let filepath = `uploads/`;
			fs.mkdirSync(filepath);
			callback(null, filepath);
		},
		filename: (req, file, callback) => {
			callback(null, file.fieldname + '.csv')
		}
	})
})

// Add interest group

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
	})
	next()
}

// Add student list

router.post('/admin/add/studentlist', upload.single('studentfile'), (req, res, next) => {
	// console.log(req.files)
	let fileArray = req.files
	console.log(req.files.studentfile)
	// const filename = req.files.studentfile.name
	// let json = csvToJson.getJsonFromCsv("uploads/" + filename);
	// for(let i=0; i<json.length;i++){
	// 	console.log(json[i]);
	// }
	res.send('Success')
	next()
})

module.exports = router