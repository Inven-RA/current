import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import FlagSlider from './flag_slider';

const Table = ({ activities, initialStateObjective, onCloseObjective, onSaveObjective }) => {


  const [tableState, setTableState] = useState({
    ObjectiveName: 'New Objective Name',
    rows: [{ id: uuid(), name: '', expression: '', weight: '', goalType: '', flag: ''}],
    popupStates: {
      sliderValue: [],
      emojiValues: [],
    },
    selectedActivities: activities
  });

  useEffect(() => {
    if (initialStateObjective !== null) {
      setTableState(initialStateObjective);
    }
  }, []);

  // console.log("ERRORRWDQDW");
  // console.log(tableState);

  const { ObjectiveName, rows, popupStates, selectedActivities} = tableState;

  /*-----OBJECTIVE-----*/

  const [firstSelectValue, setFirstSelectValue] = useState('');
  const [analyticID, setAnalyticID] = useState('');
  const [analyticType, setAnalyticType] = useState('');
  const [analytics, setAnalytics] = useState([]);
  const [editableRows, setEditableRows] = useState({});

  const handleSaveObjective = () => {

  const updatedRows = rows.map((row) => {
    // console.log("Current row:", row);
    if (editableRows[row.id]) {
      //console.log("Inside if condition");
      const activity = activities.find((activity) => String(activity.id) === row.name);
      const analytic = analytics.find((analytic) => String(analytic.id) === row.expression);
      return {
        ...row,
        name: activity ? activity.name : '',
        expression: analytic ? analytic.name : '',
      };
    }
    // console.log("Skipping if condition");
    return row;
  });

    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));

    onSaveObjective(tableState);
    onCloseObjective();

  }


  const handleCloseObjective = () => { 
    onCloseObjective();
  }

/*-----FLAGS-----*/

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PopupRow, setPopupRow] = useState('');

  const handleSavePopup = (rowId, state) => {
    setTableState(prevState => ({
      ...prevState,
      popupStates: {
        ...prevState.popupStates,
        [rowId]: {
          ...prevState.popupStates[rowId],
          sliderValue: state.sliderValue,
          emojiValues: state.emojiValues
        }
      }
    }));
  };

  const openPopup = (row) => {
    setIsPopupOpen(true);
    setPopupRow(row);
  };
  
  
  const closePopup = () => {
    setIsPopupOpen(false);
  };


  const EmojiSlider = ({ emojiValues }) => {
    if(emojiValues === undefined) return null;
    return (
      <div className="emoji-slider">
        {emojiValues.map((emoji, index) => (
          <div key={index} className="emoji-value">
            {emoji}
          </div>
        ))}
      </div>
    );
  };
  
  /*-----------------------*/
  

  const getAnalytics = () => {
    // Fetch analytics for selected activities from API
    const activityIds = firstSelectValue;
    axios.get('http://localhost:8000/analytics', {
        params: {
          activity_id: activityIds
        }
      })
      .then(response => {
        setAnalytics(response.data);
      })
      .catch(error => {
        console.error('Error fetching analytics:', error);
      });
  };

  const getAnalyticType = () => {
    // Fetch analytics for selected activities from API
    const analytics_id = analyticID;
    axios.get('http://localhost:8000/get_analytics_type', {
        params: {
          analytics_id: analytics_id
        }
      })
      .then(response => {
        setAnalyticType(response.data[0].type);
        // console.log("HERE");
      })
      .catch(error => {
        console.error('Error fetching analytics:', error);
      });
  };

  const handleDragEnd = result => {
    if (!result.destination) return;

    const updatedRows = [...rows];
    const [draggedRow] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, draggedRow);

    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));
  };

  const handleEditRow = rowId => {
    setEditableRows(prevEditableRows => ({
      ...prevEditableRows,
      [rowId]: true
    }));
  };

  const handleSaveRow = (rowId) => {
    setEditableRows((prevEditableRows) => ({
      ...prevEditableRows,
      [rowId]: false,
    }));
  
    // Perform any necessary save logic for the row
    // ...
  
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        const activity = activities.find((activity) => String(activity.id) === row.name);
        const analytic = analytics.find((analytic) => String(analytic.id) === row.expression);
        return {
          ...row,
          name: activity ? activity.name : '',
          expression: analytic ? analytic.name : '',
        };
      }
      return row;
    });

  
    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));

  };
  


  const handleInputChange = (event, rowId, columnName) => {
    const { value } = event.target;
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        return { ...row, [columnName]: value };
      }
      return row;
    });

    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));
  };

  const handleFirstInputChange = (event, rowId, columnName) => {
    const { value } = event.target;
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        // console.log("ROW NAME:")
        // console.log(value)
        return { ...row, [columnName]: value };
      }
      return row;
    });

    setFirstSelectValue(value);
    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));

    getAnalytics();

    // console.log("Activities:")
    // console.log(activities);
    // console.log("Analytics:")
    // console.log(analytics);
  };

  const handleAnalyticType = (event, rowId, columnName) => {
    const { value } = event.target;

    setAnalyticID(value);
    getAnalyticType();
  
    let updatedRows = rows.map(row => {
      if (row.id === rowId) {
        return { ...row, [columnName]: value };
      }
      return row;
    });
  
      const selectedRow = updatedRows.find(row => row.id === rowId);
      selectedRow.goalType = analyticType;
      selectedRow.id = value;

      setEditableRows((prevEditableRows) => {
        const { [rowId]: _, ...rest } = prevEditableRows;
        const updatedEditableRows = { [value]: true, ...rest };
        return updatedEditableRows;
      });
      
    setTableState(prevState => ({
      ...prevState,
      rows: updatedRows
    }));
  };

  const handleAddRow = () => {
    const newRow = {
      id: uuid(),
      name: '',
      expression: '',
      weight: '',
      goalType: '',
      flag: ''
    };

    setTableState(prevState => ({
      ...prevState,
      rows: [...prevState.rows, newRow]
    }));
  };

  useEffect(() => {
    getAnalytics();
  }, [firstSelectValue]);

  useEffect(() => {
    getAnalyticType();
  }, [analyticID]);

  const [objectiveName, setObjectiveName] = useState('New Objective Name');

  const handleObjectiveNameChange = (event) => {
    const { value } = event.target;
    setObjectiveName(value);
    setTableState((prevState) => ({
      ...prevState,
      ObjectiveName: value,
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
       <h2> <input type="text" className='editable-titles' value={objectiveName} onChange={handleObjectiveNameChange} /> </h2>

      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Analytic</th>
            <th>Weight</th>
            <th>Goal</th>
            <th>Flag</th>
            <th>Save/Edit</th>
          </tr>
        </thead>
        {/* {console.log("ROWS")} */}
        {/* {console.log(rows)} */}
        <Droppable droppableId="droppable">
          {provided => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {rows.map((row, index) => (
                <Draggable key={row.id} draggableId={row.id} index={index}>
                  {provided => (
                    <tr
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <td>
                        {editableRows[row.id] ? (
                          <select
                            value={row.name}
                            onChange={(event) =>
                              handleFirstInputChange(event, row.id, 'name')
                            }
                          >
                            <option value="">Select an activity</option>
                            {activities.map((activity) => (
                              <option key={activity.id} value={activity.id}>
                                {activity.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.name
                          )}
                      </td>
                      <td>
                        {firstSelectValue !== '' && editableRows[row.id] ? (
                          <select
                            value={row.expression}
                            onChange={(event) =>
                              handleAnalyticType(event, row.id, 'expression')
                            }
                          >
                            <option value="">Select an analytic</option>
                            {analytics.map((analytic) => (
                              <option key={analytic.id} value={analytic.id}>
                                {analytic.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.expression
                          )}
                      </td>
                      <td>
                        {editableRows[row.id] && row.goalType !== "Qualitative" ? (
                          <input
                            type="text"
                            value={`${row.weight}`}
                            onChange={event =>
                              handleInputChange(event, row.id, 'weight')
                            }
                          />
                        ) : row.goalType === "Qualitative" ? (`N/A`)
                         : (row.weight === "" || row.weight === undefined) ? ("") : (`${row.weight}%`)
                        }
                      </td>
                      <td>
                        {row.goalType}
                      </td>
                      <td>
                        {editableRows[row.id] && row.goalType !== "Qualitative" ? (
                          <button className='button-4' onClick={() => openPopup(row)}>Open Popup</button>
                        ) : row.goalType === "Qualitative" ? (`N/A`) : (
                          EmojiSlider({ emojiValues: popupStates[row.id]?.emojiValues })
                        )}
                      </td>
                      <td>
                        {editableRows[row.id] ? (
                          <button className="button-4"onClick={() => handleSaveRow(row.id)}>
                            Save
                          </button>
                        ) : (
                          <button className="button-4" onClick={() => handleEditRow(row.id)}>
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </Draggable>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button className="button-4" onClick={handleAddRow}>Add New Row</button>
                </td>
              </tr>
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>

      <button className="set-objective-button" id="button-5" onClick={handleSaveObjective}>
          Save Objective
      </button>
      
      {/* {console.log("ISPOPUPOPEN")} */}
      {/* {console.log(isPopupOpen)} */}
      {isPopupOpen && (
      <div className="popup-overlay">
        <FlagSlider
          initialState={popupStates[PopupRow.id]}
          onClose={closePopup}
          onSave={(state) => handleSavePopup(PopupRow.id, state)}
        />
      </div>
)}
    </DragDropContext>
  );
};

export default Table;
