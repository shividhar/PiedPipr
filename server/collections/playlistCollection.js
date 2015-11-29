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