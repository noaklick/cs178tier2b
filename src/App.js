import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { myKey } from './config';

function App() {

    const containerStyle = {
        width: '400px',
        height: '400px'
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    };
    // Objects for each of the feeds we ingest from PassioGo endpoint
    const [feed, setFeed] = useState({
        serviceAlerts: {},
        tripUpdates: {},
        vehiclePositions: {}
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: myKey
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    // Makes call to PassioGo endpoint and refreshes PassioGo feeds
    const refreshFeeds = async () => {
        try {
            const url = 'https://corsproxy.io/?' + encodeURIComponent('https://passio3.com/');
            const resPositions = await fetch(url + `/harvard/passioTransit/gtfs/realtime/vehiclePositions.json`);
            const jsonPositions = await resPositions.json();
            const resAlerts = await fetch(url + `/harvard/passioTransit/gtfs/realtime/serviceAlerts.json`);
            const jsonAlerts = await resAlerts.json();
            const resUpdates = await fetch(url + `/harvard/passioTransit/gtfs/realtime/tripUpdates.json`);
            const jsonUpdates = await resUpdates.json();

            console.log(jsonPositions);

            setFeed({
                serviceAlerts: jsonAlerts,
                tripUpdates: jsonUpdates,
                vehiclePositions: jsonPositions
            })

        } catch (e) {
            console.error(`An error occurred: ${e}`);
        }
    }

    // Making calls to PassioGo endpoint constantly at a specific interval in milliseconds
    useEffect(() => {
        refreshFeeds()
        // 1000 milliseconds = 1 second
        const intervalCall = setInterval(() => {
          refreshFeeds();
        }, 300000);
        return () => {
          clearInterval(intervalCall);
        };
    }, []);

    console.log(feed)

    return (
        <div>
            <p>Hello World</p>
            {isLoaded && (
             <GoogleMap
             mapContainerStyle={containerStyle}
             center={center}
             zoom={10}
             onLoad={onLoad}
             onUnmount={onUnmount}>
             <></>
             </GoogleMap>)}
        </div>
    );
}

export default App;