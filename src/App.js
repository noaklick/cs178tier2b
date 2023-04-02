import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { myKey } from './config';

function App() {

    const containerStyle = {
        width: '1000px',
        height: '1000px'
    };

    const center = {
        lat: 42.372660,
        lng: -71.118660
    };
    // Objects for each of the feeds we ingest from PassioGo endpoint
    const [vehiclePositions, setVehiclePositions] = useState({});
    const [serviceAlerts, setServiceAlerts] = useState({});
    const [tripUpdates, setTripUpdates] = useState({});
    const [dataLoading, setLoading] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: myKey
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        refreshFeeds();
        console.log("on load");
        console.log(vehiclePositions);
        if (!dataLoading) {
            console.log("loaded something");
            new window.google.maps.Marker({
                position: {lat: vehiclePositions[0]['vehicle']['position']['latitude'], 
                           lng: vehiclePositions[0]['vehicle']['position']['longitude']},
                map,
                title: "Hello World!",
            });
        }

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
            setLoading(false);

            setServiceAlerts(jsonAlerts['entity']);
            setTripUpdates(jsonUpdates);
            setVehiclePositions(jsonPositions);
            
            console.log("data loading");
            console.log(dataLoading)

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
        }, 1000);
        return () => {
          clearInterval(intervalCall);
        };
    }, []);

    //console.log(vehiclePositions)

    return (
        <div>
            <p>Welcome to HarvHop!</p>
            {isLoaded && !dataLoading && (
             <GoogleMap
             mapContainerStyle={containerStyle}
             center={center}
             zoom={15}
             onLoad={onLoad}
             onUnmount={onUnmount}>
             <></>
             </GoogleMap>)}
        </div>
    );
}

export default App;