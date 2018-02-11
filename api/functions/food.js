var http = require('https')

// Date helpers
Date.prototype.weekdayString = function() {
	return 'Söndag,Måndag,Tisdag,Onsdag,Torsdag,Fredag,Lördag'.split(',')[this.getDay()]}
Date.prototype.monthStringMMM = function() {
	return 'jan,feb,mar,apr,maj,jun,jul,aug,sep,oct,nov,dec'.split(',')[this.getMonth()]}
if (!Date.prototype.getWeek)
Date.prototype.getWeek = function() {
	// source: stackoverflow.com
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(((date.getTime() - week1.getTime()) / (24*60*60*1000) - 3 + (week1.getDay() + 6) % 7) / 7); }

// -----------------------------------------


// https://mpi.mashie.com/public/menu/KK%20VRVasastan/4465fa56?ical=True
function fetchRawFoodData(callback){
	var content = ""
	var options = {
	host: 'mpi.mashie.com',
	path: '/public/icalendar/KK%20VRVasastan/4465fa56.ics?language=sv-SE'}

	var requestCallback = function(res) {
		res.setEncoding("utf8")
		res.on("data", function (chunk) {
			content += chunk
		});

		res.on("end", function () {
			callback(null, content)
		});
	}

	var req = http.request(options, requestCallback);
	req.on('error', err=> callback(err))
	req.end()
}

// parseFoodData
function parseFoodData(rawFoodData){
	const weeks = []
	
	rawFoodData.replace(/DATE:(\d{4})(\d{2})(\d{2})/g,
		function(wholeMatch, year, month, day, index, wholeString) {
		const obj = {}

		obj.date = new Date(year, month-1, day)
		obj.name = obj.date.weekdayString()
		obj.nr = obj.date.getDay()
		const weekNr = obj.date.getWeek()

		wholeString = wholeString.replace(/\\,/g, ",")

		const afterDateString = wholeString.substr(index)
		const descName = "DESCRIPTION:"
		const descStart = afterDateString.indexOf(descName) + descName.length

		const locName = "LOCATION:"
		const descEnd = afterDateString.indexOf(locName)

		const mainName = "Huvudrätt: "
		const mainEnd = afterDateString.indexOf(mainName) + mainName.length
		const foodString = afterDateString.substr(mainEnd, descEnd - mainEnd)

		const vegName = "\\nVegetarisk: "
		const vegStart = foodString.indexOf(vegName)
		const vegEnd = vegStart + vegName.length

		const mainFood = foodString.substr(0, vegStart)
		const vegFood = foodString.substr(vegEnd)
			.replace(/\\n ?/g, '')
			.replace(/\r\n/g, '')

		if (mainFood == vegFood)
			obj.theme = 'Vegetarisk dag'
		
		obj.courses = {}
		obj.courses.main = mainFood
		obj.courses.veg = vegFood

		obj.date = Math.abs(obj.date)

		let week = weeks.find(w=> w.nr==weekNr)
		if (!week) weeks[weeks.length] = week = {nr:weekNr, days:[]}
		week.days[week.days.length] = obj
	})

	return weeks
}

module.exports = {'parseFoodData':parseFoodData,'fetchRawFoodData':fetchRawFoodData}