import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import * as XLSX from 'xlsx';

const CLIENT_ID = 'YOUR_CLIENT_ID.Schedules.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function Schedule() {
    const [meetings, setMeetings] = useState([]);
    const [meetingData, setMeetingData] = useState({ title: '', date: '', time: '' });

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            });
        };
        gapi.load('client:auth2', initClient);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingData({ ...meetingData, [name]: value });
    };

    const handleScheduleMeeting = () => {
        if (!meetingData.title || !meetingData.date || !meetingData.time) {
            alert('Please fill in all fields');
            return;
        }
        setMeetings([...meetings, meetingData]);

        // Schedule meeting in Google Calendar
        const event = {
            summary: meetingData.title,
            start: {
                dateTime: `${meetingData.date}T${meetingData.time}:00`,
                timeZone: 'America/Los_Angeles'
            },
            end: {
                dateTime: `${meetingData.date}T${meetingData.time}: 30`,
                timeZone: 'America/Los_Angeles'
            }
        };

        gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        }).then(response => {
            console.log('Meeting scheduled:', response);
        });

        setMeetingData({ title: '', date: '', time: '' });
    };

    const handleGenerateExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(meetings);
        XLSX.utils.book_Scheduleend_sheet(wb, ws, 'Meetings');
        XLSX.writeFile(wb, 'meetings.xlsx');
    };

    return (
        <div className="Schedule">
            <h1>Gmail Extension - Meeting Scheduler</h1>
            <form>
                <input
                    type="text"
                    name="title"
                    value={meetingData.title}
                    onChange={handleInputChange}
                    placeholder="Meeting Title"
                />
                <input
                    type="date"
                    name="date"
                    value={meetingData.date}
                    onChange={handleInputChange}
                    placeholder="Meeting Date"
                />
                <input
                    type="time"
                    name="time"
                    value={meetingData.time}
                    onChange={handleInputChange}
                    placeholder="Meeting Time"
                />
                <button type="button" onClick={handleScheduleMeeting}>Schedule Meeting</button>
            </form>
            <button type="button" onClick={handleGenerateExcel}>Generate Excel</button>
        </div>
    );
}

export default Schedule;