
//Get subpage
var subpage = window.location.pathname.replace(/\/$/,'').split('/');
subpage = subpage[subpage.length-1]
var pageinfo = typeof dataPage!=='undefined'? pageinfos[dataPage]: null
// var subpageinfo = !pageinfo||!subpage||!(pageinfo instanceof Array)?pageinfo:pageinfo.find(function(subpageinfo){
// 	return subpageinfo.title.replace(/ /g,"-").toLowerCase().replace("å","a").replace("ä","a").replace('ö','o') == subpage
// })

//Get id
function _(eId){
	return document.getElementById(eId)
}

//Current Firebase user
function currentUser(){
	var user = firebase.auth().currentUser
	if(user){
		var userId = firebase.auth().currentUser.uid
	}
	return user
}

// Sign out Firebase user

function logoutMember(){
	firebase.auth().signOut();
	window.location.href = '/'
}

//Firebase database access 
function db(path){
	return firebase.database().ref(path)
}

//Firebase database pull
function dbPull(path, func){
	return firebase.database().ref(path).once('value', func)
}

function serverData(path, success, error){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(JSON.parse(xhr.responseText));
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}