if (Meteor.isClient) {
	Template.trackRecommendationChoiceModal.events({
		'click #trackRecommendationChoice>div:first-of-type>a': function () {
			var videoId = Session.get('thisPlaylistData').songListToApprove[0];
			Meteor.call('addSongToPlaylist', {"videoId": videoId, playlistId: Router.current().params.playlistId}, function(err) {
				if (!err) {
					Meteor.call('removeUnapprovedSong', {"videoId": videoId, playlistId: Router.current().params.playlistId, "songPosition": 0});
				};
			});
		},
		'click #trackRecommendationChoice>div:first-of-type>span': function () {
			var videoId = Session.get('thisPlaylistData').songListToApprove[0];
			Meteor.call('removeUnapprovedSong', {"videoId": videoId, playlistId: Router.current().params.playlistId, "songPosition": 0});
		}
	});
	Template.trackRecommendationChoiceModal.rendered = function () {
		$('body').attr('class', 'stopScroll');
	};

	Template.trackRecommendationChoiceModal.helpers({
		animalName: function () {
			var names = ["Afghan Hound","Albatross","Alligator","Alpaca","Anaconda","Angelfish","Anglerfish","Ant","Anteater","Antelope","Antlion","Ape","Aphid","Armadillo","Arrow crab","Asp","***","Baboon","Badger","Bald Eagle","Bandicoot","Barnacle","Basilisk","Barracuda","Bass","Basset Hound","Bat","Beaked whale","Bear","Beaver","Bedbug","Bee","Beetle","Bird","Bison","Blackbird (Old World)","Blackbird (New World)","Black panther","Black Widow Spider","Blue Jay","Blue Whale","Boa","Bobcat","Bobolink","Bonobo","Booby","Box jellyfish","Boston Terrier","Bovid","Buffalo","Bug","Bulldog","Bull Terrier","Butterfly","Buzzard","Camel","Canid","Cape Buffalo","Cardinal","Caribou","Carp","Cat","Caterpillar","Catfish","Centipede","Cephalopod","Chameleon","Cheetah","Chickadee","Chicken","Chihuahua","Chimpanzee","Chinchilla","Chipmunk","Clam","Clownfish","Cobra","Cockroach","Cod","Collie","Condor","Constrictor","Coral","Cougar","Cow","Coyote","Crab","Crane","Crane Fly","Crawdad","Crayfish","Cricket","Crocodile","Crow","Cuckoo","Daddy longlegs","Damselfly","Deer","Dingo","Dinosaur","Dog","Dolphin","Donkey","Dormouse","Dove","Dragonfly","Duck","Dung beetle","Eagle","Earthworm","Earwig","Echidna","Eel","Egret","Elephant","Elephant seal","Elk","Emu","English pointer","English Setter","Ermine","Falcon","Ferret","Finch","Firefly","Fish","Flamingo","Flea","Fly","Flyingfish","Fowl","Fox","Frog","Fruit Bat","Gazelle","Gecko","Gerbil","German Shepherd","Giant Panda","Giant squid","Gibbon","Gila monster","Guanaco","Guineafowl","Giraffe","Goat","Golden Retriever","Goldfinch","Goldfish","Goose","Gopher","Gorilla","Grasshopper","Great Blue Heron","Great Dane","Great white shark","Greyhound","Grizzly Bear","Grouse","Guinea pig","Gull","Guppy","Haddock","Halibut","Hammerhead shark","Hamster","Hare","Harrier","Hawk","Hedgehog","Hermit crab","Heron","Herring","Hippopotamus","Hookworm","Hornet","Horse","Hound","Human","Hummingbird","Humpback Whale","Husky","Hyena","Iguana","Impala","Insect","Irish Setter","Irish Wolfhound","Irukandji jellyfish","Jackal","Jaguar","Jay","Jellyfish","Kangaroo","Kangaroo mouse","Kangaroo rat","Kingfisher","Kite","Kiwi","Koala","Koi","Komodo dragon","Krill","Labrador Retriever","Ladybug","Lamprey","Lark","Leech","Lemming","Lemur","Leopard","Leopon","Liger","Lion","Lizard","Llama","Lobster","Locust","Loon","Louse","Lungfish","Lynx","Macaw","Mackerel","Magpie","Mammal","Mammoth","Manta Ray","Marlin","Marmoset","Marmot","Marsupial","Marten","Mastiff","Mastodon","Meadowlark","Meerkat","Mink","Minnow","Mite","Mockingbird","Mole","Mollusk","Mongoose","Monitor lizard","Monkey","Moose","Mosquito","Moth","Mountain goat","Mouse","Mule","Muskox","Mussel","Narwhal","Newt","Nightingale","Ocelot","Octopus","Old English Sheepdog","Opossum","Orangutan","Orca","Ostrich","Otter","Owl","Ox","Oyster","Panda","Panther","Panthera hybrid","Parakeet","Parrot","Parrotfish","Partridge","Peacock","Peafowl","Pekingese","Pelican","Penguin","Perch","Peregrine Falcon","Persian Cat","Pheasant","Pig","Pigeon","Pike","Pilot whale","Pinniped","Piranha","Planarian","Platypus","Polar bear","Pony","Poodle","Porcupine","Porpoise","Portuguese Man o' War","Possum","Prairie dog","Prawn","Praying Mantis","Primate","Puffin","Puma","Python","Quail","Rabbit","Raccoon","Rainbow trout","Rat","Rattlesnake","Raven","Ray (Batoidea)","Ray (Rajiformes)","Red Panda","Reindeer","Rhinoceros","Right whale","Roadrunner","Robin","Rodent","Rook","Rooster","Roundworm","Saber-toothed cat","Sailfish","Saint Bernard","Salamander","Salmon","Sawfish","Scale insect","Scallop","Scorpion","Sea cow","Seahorse","Sea lion","Sea slug","Sea urchin","Setter","Shark","Sheep","Shrew","Shrimp","Siamese Cat","Silkworm","Silverfish","Skink","Skunk","Sloth","Slug","Smelt","Snail","Snake","Snipe","Snow Leopard","Sockeye salmon","Sole","Spaniel","Sparrow","Sperm whale","Spider","Spider monkey","Spoonbill","Squid","Squirrel","Starfish","Star-nosed Mole","Steelhead trout","Stingray","Stoat","Stork","Sturgeon","Sugar Glider","Swallow","Swan","Swift","Swordfish","Swordtail","Tabby cat","Tahr","Takin","Tapeworm","Tapir","Tarantula","Tasmanian Devil","Termite","Tern","Terrier","Thrush","Tick","Tiger","Tiger shark","Tigon","Toad","Tortoise","Toucan","Toy Poodle","Trapdoor spider","Tree frog","Trout","Tuna","Turkey","Turtle","Tyrannosaurus","Urial","Vampire bat","Viper","Vole","Vulture","Wallaby","Walrus","Wasp","Warbler","Water Buffalo","Weasel","Whale","Whitefish","Whooping Crane","Wildcat","Wildebeest","Wildfowl","Wolf","Wolverine","Wombat","Woodpecker","Worm","Wren","Yak","Zebra"];
			return names[Math.floor((names.length-1)*Math.random())]
		},
		trackTitle: function() {
			return Session.get("songData" + this.valueOf())? Session.get("songData" + this.valueOf()).title: '';
		},
		trackAuthor: function() {
			return Session.get("songData" + this.valueOf())? Session.get("songData" + this.valueOf()).author: '';
		},
		trackThumb: function() {
			return Session.get("songData" + this.valueOf())? Session.get("songData" + this.valueOf()).thumb: '';
		},
		apiCall: function(){
	        if(dataApiReady.get()){
	            var request = gapi.client.youtube.videos.list({part: 'snippet', id: this.valueOf(), maxResults: 1 });
	            request.execute(
	                function(response){
	                    if(response.items && response.items.length > 0){
	                        var data = Session.get("songData" + response.items[0].id);
	                        if(!data){
	                            data = {};
	                        };
	                        data.title = response.items[0].snippet.title;
	                        data.author = response.items[0].snippet.channelTitle;
	                        data.thumb = response.items[0].snippet.thumbnails.default.url;
	                        Session.set("songData" + response.items[0].id, data);
	                    };
	                }
	            );
	            
	        };
	       
	        return this;
	    },
	    latestSongToAdd: function() {
	    	return Session.get('thisPlaylistData')? Session.get('thisPlaylistData').songListToApprove[0]: false;
	    }
	});
};