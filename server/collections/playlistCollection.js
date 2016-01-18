if(Meteor.isServer){
    var Schema = {};

    Schema.Playlists = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        authorId: {
            type: String,
            optional: false
        },
        playlistId: {
            type: String,
            optional: false
        },
        playlistName: {
            type: String,
            defaultValue: "Untitled Infatrode",
            optional: true
        },
        songList: {
            type: [String],
            optional: false
        },
        songListToApprove: {
            type: [String],
            defaultValue: [],
            optional: false
        },
        hostSongPosition: {
            type: Number,
            defaultValue: 0,
            optional: false
        },
        hostSongVideoId: {
            type: String,
            optional: true
        },
        locationLongitude: {
            type: Number,
            decimal: true,
            optional: true
        },
        locationLatitude: {
            type: Number,
            decimal: true,
            optional: true
        },
        wifiAccessPointMacAddress: {
            type: String,
            optional: true
        }
    })

    Playlists.attachSchema(Schema.Playlists);

    Playlists.allow({
        insert: function(userId, doc) {
            throw new Meteor.Error(403, "Unauthorized Access. Please utilize proper streams of action.");
            return false
        },
        update: function(userId, doc, fieldNames, modifier) {
            throw new Meteor.Error(403, 'Unauthorized Access.')
            return false;
        },
        remove: function(userId, doc) {
            throw new Meteor.Error(403, 'Unauthorized Access.')
            return false
        }
    });
}