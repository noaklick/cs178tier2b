import React, { useEffect, useState } from "react";
import Map from "./containers/Map";

function App() {
    // Objects for each of the feeds we ingest from PassioGo endpoint
    const [feed, setFeed] = useState({
        serviceAlerts: {},
        tripUpdates: {},
        vehiclePositions: {}
    });
    const [dataLoading, setLoading] = useState(true);

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
        <Map
            feed={feed}
            dataLoading={dataLoading}
        />
    );
}

export default App;