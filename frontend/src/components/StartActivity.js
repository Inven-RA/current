import React, { useEffect, useState, useRef } from 'react';
import Table from "react-bootstrap/Table";
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CssBaseline from '@mui/material/CssBaseline';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/* GLOBAL VARS */

var iapID;
var config_url;
var Analytic;
var userId;
var Activity_id;
var Analytic_id;
var objective_id;

var Obj_id;

const App = () => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const { id } = useParams();
    const iframeRef = useRef(null);
    const [configURL, setConfigURL] = useState(null);
    const [NameIap, setNameIAP] = useState(null);
    const [AnalyticId, setAnalyticId] = useState(null);
    const [objectiveId, setObjectiveId] = useState(null);
    const [json_params, setjson_params] = useState('');
    const [json_paramsdata, setjson_paramsdata] = useState('');
    const [actid, setactid] = useState('');
    const [InputValue, setInputValue] = useState('');
    const [objid, setobjid] = useState('');
    iapID = id;

    //Get Activity Provider Parameters
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND + '/activity/' + iapID);
            const jsonData = await response.json();
            setConfigURL(jsonData.config_url);
            setNameIAP(jsonData.name);
            setjson_params(jsonData.json_params_url);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
    }, []);
    //Funciona o fecth Json_Params
    useEffect(() => {
        const Jparams = async () => {
        try {
            const response = await fetch(json_params);
            const jsonData = await response.json();
           // alert(json_params);
            setjson_paramsdata(jsonData[0].name);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        Jparams();
    }, [json_params]);    
    //Get IAP ID
    useEffect(() => {
    const acid = async () => {
      try {
        const response = await fetch('http://localhost:8000/activities?acid=' + iapID);
        const jsonData = await response.json();
        setactid(jsonData[0].id);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    acid();
    }, []);

    useEffect(() => {
        //Get Analytic ID
        const analy = async () => {
        try {
            if (!actid) return; // Return early if actid is not available yet
            const response = await fetch('http://localhost:8000/analytics?activity_id=' + actid);
            const jsonData = await response.json();
            if (jsonData.length > 0) {
            setAnalyticId(jsonData[0].id);
            } else {
            console.error('No analytics data available.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        analy();
    }, [actid]);
    //Get Objective ID
    useEffect(() => {
        const obj = async () => {
        try {
            if (!AnalyticId) return; // Return early if AnalyticId is not available yet
            const response = await fetch('http://localhost:8000/objectivesanalytics?analytics_id=' + AnalyticId);
            const jsonData = await response.json();
            if (jsonData.length > 0) {
            setObjectiveId(jsonData[0].objective_id);
            } else {
            console.error('No objective data available.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        obj();
    }, [AnalyticId]);
    //Get Objective ID
    useEffect(() => {
        const obj = async () => {
        try {
            if (!AnalyticId) return; // Return early if AnalyticId is not available yet
            const response = await fetch('http://localhost:8000/objectives?id=' + objectiveId);
            const jsonData = await response.json();
            if (jsonData.length > 0) {
            setObjectiveId(jsonData[0].id);
            console.log(objectiveId);
            } else {
            console.error('No objective data available.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        obj();
    }, [objectiveId]);


const [isDataSent, setIsDataSent] = useState(false);

useEffect(() => {
    if (isDataSent) {
        const formData = {
            user_id: 1,
            analytics_id: AnalyticId,
            objective_id: objectiveId,
            score: InputValue
        };

        console.log(formData);

        fetch('http://localhost:8000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                // Request successful, handle the response
                console.log('Form data sent successfully!');
                // Perform any additional actions or display success message
            } else {
                // Request failed, handle the error
                console.error('Error sending form data.');
                // Display error message or perform any error handling
            }
        })
        .catch(error => {
            console.error('An error occurred:', error);
            // Display error message or perform any error handling
        });
    }
}, [isDataSent]);

const handleSubmit = () => {
    var percentage;
    const iframeWindow = iframeRef.current.contentWindow;
    //alert(json_paramsdata);
    iframeWindow.postMessage({ action: 'getElementValue', elementId: json_paramsdata }, '*');
    iframeWindow.postMessage({ action: 'ExecutarHandleSubmit', elementId: 1 }, '*');
    //iframeWindow.postMessage("ExecutarHandleSubmit", "*");
    window.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'elementValue') {
            const { value } = event.data;
            setInputValue(value);
            setIsDataSent(true); // Marcar os dados como prontos para envio
            //alert(value);
            percentage = value;
        }
    });
};
    const handleIframeLoad = () => {
        console.log('Loaded');
    };
     //console.log("Teste:" + configURL);

    return (
        <div>
        <h1>{NameIap}</h1>
        <iframe
            id="testeFrame"
            src={configURL}
            width="100%"
            height="500px"
            title="Activity Page"
            ref={iframeRef}
            onLoad={handleIframeLoad}
            allow="same-origin allow-scripts"
        />
        <Button onClick={handleSubmit} type="submit" id="save">Save</Button>
        </div>
    );
};

export default App;
