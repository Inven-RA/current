import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './edit_iap.css';
import Table from './drag_table.js';
import { Link } from 'react-router-dom';


const EditIAP = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [objectives, setObjectives] = useState([{
    ObjectiveName: '',
    rows: [],
    PopupStates: [],
    selectedActivities: []
  }]);

  const [editingObjective, setEditingObjective] = useState(null);


  const [showObjective, setShowObjective] = useState(false);

  const handleShowObjective = () => {
    setShowObjective(true);
  };

  const handleCloseObjective = () => {
    setShowObjective(false);
  };

  useEffect(() => {
    // Fetch activities from API
    axios.get('http://localhost:8000/activities')
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
      });
  }, []);

  const handleSelectActivity = (activity) => {
    setSelectedActivities([...selectedActivities, activity]);
  };

  const handleRemoveActivity = (activity) => {
    const updatedSelectedActivities = selectedActivities.filter(
      selectedActivity => selectedActivity.id !== activity.id
    );
    setSelectedActivities(updatedSelectedActivities);
  };
  

  const [iapName, setIapName] = useState('New IAP Name');

  const handleIapNameChange = (event) => {
    setIapName(event.target.value);
  };

  const handleEditObjective = (index) => {
    const objectiveToEdit = objectives[index];
  
    // Set the currently editing objective to the selected objective
    setShowObjective(true);
    setEditingObjective(objectiveToEdit);
  
    // Perform any additional logic or actions required for editing an objective
  };
  
  const handleRemoveObjective = (index) => {
    const updatedObjectives = [...objectives];
    updatedObjectives.splice(index, 1);
    setObjectives(updatedObjectives);
  };

  const onCloseObjective = () => {
    setEditingObjective(null);
    setShowObjective(false);
  };
  
  const onSaveObjective = (updatedObjective) => {
    const updatedObjectives = [...objectives];
    const index = objectives.findIndex((objective) => objective === editingObjective);
  
    if (index !== -1) {
      updatedObjectives[index] = updatedObjective;
    } else {
      updatedObjectives.push(updatedObjective); // Add the updated objective to the array
    }
    
    setObjectives(updatedObjectives);
    setEditingObjective(null);
  };

  const handleCreate = () => {
    postIAP();

    console.log("GET objectives");
    axios.get('http://localhost:8000/objectives')
      .then(response => {
        console.log(response.data);
        })
      .catch(error => { 
        console.error('Error fetching objectives:', error);
      });
     
    console.log("GET scores");
    axios.get('http://localhost:8000/scores')
      .then(response => {
        console.log(response.data);
        })
      .catch(error => { 
        console.error('Error fetching scores:', error);
      });
    }
  
  const postIAP = () => {
    const data = {
      name: iapName
    };
  
    axios.post('http://localhost:8000/iaps', data)
      .then(response => {
        console.log(response);
        postObjectives(response.data.id);
      })
      .catch(error => {
        console.error('Error creating IAP:', error.response);
      });
  };

  const postObjectives = (iapId) => {
    var objective_id = 0;
    objectives.map((objective, index) => {
      if (objective.ObjectiveName !== '') {    
        console.log("LOOK HERE")
        console.log(objective)
        console.log(iapId)
        const data = {
          name: objective.ObjectiveName,
          iap_id: iapId
        };
        axios.post('http://localhost:8000/objectives', data)
          .then(response => {
            console.log(response);
            objective_id = response.data.id;
            objective.rows.map((row, index) => {
              postObjectivesAnalytics(row, objective_id);
              postScores(objective_id,row.id);
          })
          postFlags(objective_id);
        })
          .catch(error => {
            console.error('Error creating objective:', error.response);
          });
      }
    })

  };

  const postObjectivesAnalytics = (row, id) => {
    const data = {
      objective_id: id,
      analytics_id: row.id,
      weight: row.weight
    };
    axios.post('http://localhost:8000/objectivesanalytics', data)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Error creating objective analytics:', error.response);
      });
  };

  const postFlags = async (objective_id) => {
    try { // Replace with your own logic to retrieve objectives
      for (const objective of objectives) {
        if (objective.ObjectiveName !== '') {
          const keys = Object.keys(objective.popupStates);
          for (const key of keys) {
            if (key === 'emojiValues' || key === 'sliderValue') {
              continue;
            }
            const analytics_id = key;
            const emojiValues = objective.popupStates[key].emojiValues;
            const sliderValue = objective.popupStates[key].sliderValue;
            //sort sliderValue
            sliderValue.sort(function(a, b){return a - b});
  
            for (let i = 0; i < emojiValues.length; i++) {
              const data = {
                analytics_id: analytics_id,
                flag: emojiValues[i],
                min_value: sliderValue[i],
                max_value: sliderValue[i+1]
              };
  
              const response1 = await axios.post('http://localhost:8000/flags', data);
              console.log(response1);
              const flag_id = response1.data.id;
  
              const data2 = { flag_id: flag_id, objective_id: objective_id };
              const response2 = await axios.post('http://localhost:8000/flagsobjectives', data2);
              console.log(response2);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const postScores = (objective_id,rowId) => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      numbers.map((i) => {
        const data = {
          user_id: i,
          analytics_id: rowId,
          objective_id: objective_id,
          score: i*10
        };
        axios.post('http://localhost:8000/scores', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('Error creating score:', error.response);
          });
        });
  };

  return (
    <div className="container">
      <div className="title">
        <h1><input className='editable-titles' type="text" value={iapName} onChange={handleIapNameChange}/></h1>

        <div className="objectives">
        <h2>Objectives</h2>
        <br></br>
        <table>
          {objectives.map((objective, index) => (
            objective.ObjectiveName !== '' ? (
            <tr key={index}>
              <td>{objective.ObjectiveName}</td>
              <td>
                <button className="button-4" onClick={() => handleEditObjective(index)}>
                  Edit
                </button>
                <button className="button-4" onClick={() => handleRemoveObjective(index)}>
                  Remove
                </button>
              </td>
            </tr>
          ) : null))}
        </table>
      </div>


        <div className="left-list">
        <h2>Activities</h2>
        <table>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>
              {activity.name}
              </td>
              <td>
              <button className="button-4" onClick={() => handleSelectActivity(activity)}>
                Add
              </button>
              </td>
              
            </tr>
          ))}
        </table>
      </div>
      <div className="right-list">
        <h2>Selected Activities</h2>
        <table>
          {selectedActivities.map(activity => (
            <tr key={activity.id}>
              <td>
              {activity.name}
              </td>
              <td>
              <button className="button-4" onClick={() => handleRemoveActivity(activity)}>
                Remove
              </button>
              </td>
            </tr>
          ))}
        </table>
        </div>
      </div>
        
        <div className="bottom-section">
            <div className="popup-overlay2" style={{ display: showObjective ? 'block' : 'none' }}>
                <div className="popup2">
                {      
                    <div className="table">
                    {showObjective ? (
                      <Table
                        activities={editingObjective === null ? selectedActivities : editingObjective.selectedActivities}
                        initialStateObjective={editingObjective}
                        onCloseObjective={onCloseObjective}
                        onSaveObjective={onSaveObjective}
                      />
                    ) : null}
                    </div>
                }
                </div>
            </div>
            <button className="set-objective-button" id="button-5" onClick={handleShowObjective}>Create Objective</button>
            <br></br>
            <br></br>
            <Link to="/live-iaps" style={{ textDecoration: 'none', color: 'white' }}>
              <button className="set-objective-button" id="button-5" onClick={handleCreate}> Create IAP </button>
            </Link>
            <div>
        </div>
        </div>   
    </div>
  );
};

export default EditIAP;
