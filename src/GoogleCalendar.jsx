import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import * as XLSX from 'xlsx';

const CLIENT_ID = '339626165825-kcckn2c8t5qp14trpl05bm03dpk8aokq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDeYkdhDK1nlCg3fCNkPRiTHDRPzMN1Zyg';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const GoogleCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: SCOPES,
            }).then(() => {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            }).catch(error => {
                console.error('Error initializing Google API client:', error);
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    const updateSigninStatus = (isSignedIn) => {
        setIsSignedIn(isSignedIn);
    };

    const handleAuthClick = () => {
        gapi.auth2.getAuthInstance().signIn();
    };

    const handleSignoutClick = () => {
        gapi.auth2.getAuthInstance().signOut();
    };

    const listUpcomingEvents = () => {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(response => {
            const events = response.result.items;
            if (events.length > 0) {
                const data = [["Start Time", "End Time", "Summary"]];
                events.forEach(event => {
                    const whenStart = event.start.dateTime || event.start.date;
                    const  whenEnd = event.end.dateTime || event.end.date;
                    data.push([whenStart, whenEnd, event.summary]);
                });
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, "Events");
                XLSX.writeFile(wb, "events.xlsx");
            } else {
                console.log('No upcoming events found.');
            }
        }).catch(error => {
            console.error('Error fetching events:', error.message);
        });
    };

    return (
        <div>
            {isSignedIn ? (
                <div>
                    <button onClick={handleSignoutClick}>Sign Out</button>
                    <button onClick={listUpcomingEvents}>List Upcoming Events</button>
                </div>
            ) : (
                <button onClick={handleAuthClick}>Authorize</button>
            )}
        </div>
    );
};

export default GoogleCalendar;