
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

//Get class

function __(eClass){
	return document.querySelector('.' + eClass)
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

// Firebase onAuthStateChanged
function auth(func){
	return firebase.auth().onAuthStateChanged(func)
}

// Authenticate if user is member

function authenticateMember(){
	var authenticatedMember = undefined
	var userEmail
	auth(function(user){
		if(user){
			user.providerData.forEach(profile =>{
				userEmail = profile.email.replace(/\./g,'%2E')
				dbPull('students/' + userEmail, student => {
					if(student.val().member){
						authenticatedMember = true
						dbPull('admins/' + userEmail, admin => {
							if(admin.val()){
								var sideBar = __('signed-in-nav')
								var adminBtn = document.createElement('a')
								adminBtn.classList.add('admin-btn')
								adminBtn.setAttribute('href', '/admin')
								adminBtn.innerHTML = 'Admin'
								sideBar.appendChild(adminBtn)
							}
						})
					}else{
						authenticatedMember = false
					}
					checkMemberAuth(authenticatedMember)
				})
			})
		}else{
			authenticatedMember = false
			checkMemberAuth(authenticatedMember)
		}
	})

	function checkMemberAuth(status){
		if(status != undefined){
			console.log(status)
			if(status){
				console.log('hurray')
			}else{
				console.log('uuuuuuuuh')
				window.location.replace('/')
			}
		}
	}
}

// Authenticate Admin

function authenticateAdmin(cbSuccess, cbFailure){
	var authenticatedAdmin = undefined
	var userEmail
	auth(function(user){
		if(user){
			user.providerData.forEach(profile =>{
				userEmail = profile.email.replace(/\./g,'%2E')
				dbPull('admins/' + userEmail, admin => {
					if(admin.val()){
						authenticatedAdmin = true
					}else{
						authenticatedAdmin = false
					}
					checkAdminAuth(authenticatedAdmin)
				})
			})
		}else{
			authenticatedAdmin = false
			checkAdminAuth(authenticatedAdmin)
		}
	})

	function checkAdminAuth(status){
		if(status != undefined){
			console.log(status)
			if(status){
				console.log('hurray')
				if(cbSuccess != undefined){
					cbSuccess()
				}
			}else{
				console.log('uuuuuuuuh')
				if(cbFailure != undefined){
					cbFailure()
				}
			}
		}
	}
}

// User Authentication Admin

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