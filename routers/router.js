"use strict";
const express = require('express')

const async = require('asyncawait/async');
const await = require('asyncawait/await');



module.exports = (function() {
  var router = express.Router();
  // ---------------------------
  
  //Array with pages
  var routes = [
    {page:'start', path:'/'},
    {page:'contact'},
    {page:'signed-in-home', path:'user', robots:'noindex'},
    {page:'new-user'},
    {page:'matsedel', path:'user/food'},
    {page:'classpoints', path:'user/classpoints'},
    {page:'discount-card', path:'user/discount-card'},
    {page:'styrelsen', path:'user/board'},
    {page:'styrelsen-roll',path:'user/board/:name', dataGen: req=>{
      return {styrelsen:req.params.name}
    }},
    {page:'utskott', path:'user/committees'},
    {page:'utskott-sida',path:'user/committees/:name', dataGen: req=>{
      return {utskott:req.params.name}
    }},
    {page:'interest-groups', path:'user/interest-groups'},
    {page:'interest-group',path:'user/interest-groups/:name', dataGen: req=>{
      return {interestGroups:req.params.name}
    }},
    {page:'create-group'},
    {page:'group-success', path:'success'},
    {page:'admin'},
    {page:'add-student', path:'admin/add-student'}
  ]
  
  // Loop through the routes array and
  // register them with the express router
  for (var i = 0; i<routes.length; i++) {
    var route = routes[i]
    if (!route.path) route.path = route.page

    router.get('/'+route.path, (function(route) {
      return function(req, res) {
        async (function(){
          route.data = route.dataGen ? route.dataGen(req) : {}
          if (route.fn && await (route.fn(req, res, route.data)) === false) return;
          if (!route.data.title) route.data.title = 'VRO Elevkår'
          route.data.dataPage = route.page
          console.log(route.data)
          res.render('templates/pages/'+route.page, route.data)
        })()
      }
    })(route) )
  }

  // -----------
  return router;    
})();