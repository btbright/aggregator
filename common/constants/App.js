export default {
	React : {
		ROOTELEMENTID : "react-root"
	},
	Aggregator : {
		CLICKTIMEOUT : 300,
		FLASHLENGTH : 300,
		CLICKTHRESHOLD : 200,
		INITIALIZATIONTIME : 2000,
		COMPLETEDTIME : 3500,
		RETIREMENTTIME : 400,
		SERVERUPDATEFREQUENCY : 100,
		types : {
			message : {
				NOMINATIONTHRESHOLD : 1,
				INITIALIZATIONTIME : 2000
			},
			permagator : {
				NOMINATIONTHRESHOLD : 3,
				INITIALIZATIONTIME : 1000
			}
		}
	},
	Chat : {
		STALESECONDS : 60,
		SERVERUPDATEFREQUENCY : 100
	},
	Notifications : {
		TIMETOSHOW : 4500
	},
	App : {
		BUFFERTIME : 150, 
		MAXUSERS : 5
	},
	Room : {
		ACTIVECLICKERTIMETHRESHOLD : 1000 * 60 * 2,
		SERVERUPDATEFREQUENCY : 1000
	},
	Points : {
		Notifications : {
			POINTDESCRIPTORS : [
				'internet'
			]
		}
	}
}