import React from 'react';
// source for basic fetching: Kian Attari
// loops: Emilio DeLeon
import { useState, useEffect } from 'react';

export default function Map() {
	// fetching code from Kian Attari
	const [data, setData] = useState(null);
  	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState(null);
  	const url =
    'https://corsproxy.io/?' + encodeURIComponent('https://passio3.com/');
  	useEffect(() => {
    fetch(url + `/harvard/passioTransit/gtfs/realtime/vehiclePositions.json`)
      .then((response) => response.json())
      .then((usefulData) => {
        console.log(usefulData);
        setLoading(false);
        setData(usefulData);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  	  }, []);
	return (
		<div className="Map">
        	{loading && <p>Loading...</p>}
        	{!loading && data['entity'].map((e) => 
        		(<p key={e.id} >{Object.keys(e.vehicle)}</p>)
            )}
            <button onClick ={() => console.log(data['entity'])}> your button</button>
      	</div>
		);
}