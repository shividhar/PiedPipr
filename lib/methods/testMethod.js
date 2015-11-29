Meteor.methods({
	httpRequest: function(){
		if(Meteor.isServer){
			HTTP.get("http://webservices.amazon.com/onca/xml", {"params": {"AWSAccessKeyId": "AKIAJB4QBZKFPWKXHLIQ", "AssociateTag": "lio03-20", "Keywords": "Mustang", "Operation": "ItemSearch", "SearchIndex": "Blended", "Service": "AWSECommerceService", "Timestamp": "2015-11-29T07:36:43.000Z", "Signature": "0OqWENHqWnkgx1g4hZyIMa0u4W+CG4xd+7vwXGndAF8="}}, function(err, res){
				if(err){
					console.log(err)
					return false
				}else{
					console.log(res)
				}
			})
		}
	}
})