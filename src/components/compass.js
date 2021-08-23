import * as React from 'react';
import * as Tone from 'tone'

class Location {
	constructor(lon, lat) {
		this.lon = lon;
		this.lat = lat;
	}
	get coordinates() {
		return { lon: this.lon, lat: this.lat };
	}
}

const Compass = () => {
	const targetLocationBox = React.createRef();
	
	React.useEffect(() => {
		const synth = new Tone.MonoSynth({
			oscillator: {
				type: "amsine"
			}
		}).toDestination();

		const loop = new Tone.Loop(time => {
			synth.triggerAttackRelease("D4", 0.01, time);
		},"4n").start(0);	
	});
	
	const getUserPosition = () => {
		return new Promise((resolve, reject) => {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(position => {
					resolve(new Location(
						position.coords.longitude,
						position.coords.latitude));
				});
			} else {
				reject("HTML5 geolocation not supported by browser.")
			}
		});
		
	}

	const getDistance = (pos1, pos2) => {
		if(pos1 !== null && pos2 !== null) {
			
			const lat1 = pos1.coordinates.lat;
			const lat2 = pos2.coordinates.lat;
			const lon1 = pos1.coordinates.lon;
			const lon2 = pos2.coordinates.lon;
			console.log("user lon + lat: " + lon1 + " " + lat1);
			console.log("target lon + lat: " + lon2 + " " + lat2);

			/* Haversine formula to calculate distance
			 * https://www.movable-type.co.uk/scripts/latlong.html
			 * 
			 * Author/Copyright holder: Chris Veness
			 * Provided under a MIT-licence
			 * (https://opensource.org/licenses/MIT)
			 * 
			 * https://www.movable-type.co.uk/scripts/latlong.html
			 */ 

			const R = 6371e3; // metres
			const φ1 = lat1 * Math.PI/180; // φ, λ in radians
			const φ2 = lat2 * Math.PI/180;
			const Δφ = (lat2-lat1) * Math.PI/180;
			const Δλ = (lon2-lon1) * Math.PI/180;

			const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
					Math.cos(φ1) * Math.cos(φ2) *
					Math.sin(Δλ/2) * Math.sin(Δλ/2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

			const d = R * c; // in metres
			/* End of script */

			initSound(d);
			
		}
	}
	const initSound = (distance) => {
		if(Tone.Transport.state === "started") {
			Tone.Transport.bpm.rampTo(getPingInterval(distance), 1);
		} else {
			Tone.Transport.bpm.value = getPingInterval(distance);
			Tone.Transport.start();
		}
	}

	const getPingInterval = (distance) => {
		if(distance !== undefined) {
			if(distance < 10000) {
				return (100 / distance) * 600;
			} else {
				return 6;
			}
		}
	}
	const handleSubmit = (event) => {

		// Get user position
		getUserPosition().then(upos => {

			// Get destination position
			new Promise((resolve, reject) => {
				const queryString = targetLocationBox.current.value;
				if(queryString !== null || queryString !== "" || queryString !== undefined) {

					// Query string for api GET request
					const query = "https://nominatim.openstreetmap.org/search?q=" + queryString + "&format=json&addressdetails=1&limit=1";
					console.log(query);					
					fetch(query).then(result => {
						if(result.ok) {
							result.json()
							.then(json => {
								if(json[0] === undefined || json[0] === null) {
									reject(new Error("API request returned nothing."));
								} else {
									resolve(new Location(json[0].lon, json[0].lat));
								}
								
							}).catch(e => {
								reject(e);
							})
						} else reject(new Error("API query failed: " + result.status + "."));
					}).catch(e => {
						reject(e);
					});
				} else reject(new Error("Params for getDestinationPosition cannot be " + queryString));
			}).then(lpos => {
				getDistance(upos, lpos);
			}).catch(e => console.error('Error: ' + e));
		}).catch(e => console.error('Error: ' + e));
		event.preventDefault();
	}

	return(
		<section className="section">
			<form onSubmit={handleSubmit}>
				<div className="field has-addons">
					<div className="control">
						<input
							className="input"
							type="text"
							ref={targetLocationBox}
						/>
					</div>
					<div className="control">
						<input className="button" type="submit" value="Go!" />
					</div>
				</div>
			</form>
		</section>
	);
}
export default Compass;