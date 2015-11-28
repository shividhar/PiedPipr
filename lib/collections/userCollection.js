if(Meteor.isServer){
	//Used to make sure Meteor.user() is not undefined
	Meteor.publish("userSettings", function(){
		if(this.userId){
			return Meteor.users.find({_id : this.userId});
		}else{
			this.ready();
		};
	});
}