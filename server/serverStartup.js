Meteor.startup(function () {
    if(Meteor.isServer){
        AccountsGuest.enabled = true;
        AccountsGuest.name = true
        AccountsGuest.anonymous = true;
    }
})