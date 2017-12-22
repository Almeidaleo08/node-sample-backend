//Busca de roles com grant nas paginas --> busca no arquivo lib/pagesroles
//EasterEgg: calcule complexidade do algoritmo... O(n^3)? Acertou! Agora reduza! 

module.exports = app => {
	
	const Roles = app.libs.pagesroles;

	return {
		verify: (user_role, route, httpmethod) => {

			var authorized = 0;

			for(var i = 0; i < Roles.URL.Route.length && authorized==0; i++){
				if(route == Roles.URL.Route[i].name){

					  for(var j = 0; j < Roles.URL.Route[i].method.length; j++){
					  		if(httpmethod == Roles.URL.Route[i].method[j]){
					  				
					  				 for(var k = 0; k < Roles.URL.Route[i].roles.length; k++){
						  				 	if(user_role == Roles.URL.Route[i].roles[k]){			
						    					authorized = 1;
						    					break;
						  					}
					  				 }
					  				break;
					  		}
					  }
					  
				}
			}

			return authorized;
		}
	}
};