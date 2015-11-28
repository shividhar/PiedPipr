if(Meteor.isServer){
	Meteor.startup(function () {
        AccountsGuest.enabled = true;
        AccountsGuest.name = true
        AccountsGuest.anonymous = true;
	})
}
