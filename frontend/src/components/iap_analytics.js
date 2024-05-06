import React, { useState } from 'react';
import Table from "react-bootstrap/Table";
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CssBaseline from '@mui/material/CssBaseline';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';


/* GLOBAL VARS */
var content = [];
var condition_ = "";
var filteredData_global = []
var OrderData = [];
var displayFilter = false;
var displayOrder = false;
var filter_slices = [];
var users = [];
var objectives = [];
var objectives_ids = [];
var analytics = [];
var analytics_ids = [];
var scores = [];
var iaps = [];
var objectivesAnalytics = [];
var objectivesAnalytics_objIDs = [];
var flags = [];
var flagsObjectives = [];
var iapID;
var iapName;
var popup_userID;



function Get_IAP_name() {
  const { id } = useParams();
  iapID = id;

  for (var i = 0; i < iaps.length; i++) {
    if (iaps[i].id.toString() == iapID){
      iapName = (iaps[i].name);
    } 
  }

  localStorage.setItem( 'Iap' , iapID); 

}

/* FILTER & ORDER BUTTONS */
const checkboxes = [
  {
    name: ' Only Positives',
    key: 'checkBox1',
    label: 'Check Box 1',
  },
  {
    name: ' Only Negatives',
    key: 'checkBox2',
    label: 'Check Box 2',
  },
  {
    name: ' All below 30%',
    key: 'checkBox3',
    label: 'Check Box 3',
  },
  {
    name: ' Zero in some objective',
    key: 'checkBox4',
    label: 'Check Box 4',
  },
  {
    name: ' With emoji',
    key: 'checkBox5',
    label: 'Check Box 5',
  },
];
class Filter_and_Order extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      displayOrderBox: false, // New state to control the visibility of the orderBox
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {

    displayFilter = false; // deixar de dar display ao filter
    displayOrder = !displayOrder;

    this.setState({
      isClicked: displayOrder,
      displayOrderBox: displayOrder, // Update the state to control the visibility of the orderBox
    });

  }

  order(props) {
    const { isClicked } = this.state;

    return (
      <div>
        <MyDinamicFilter/>
        
        { //isto é o order
        <NavItem>
          <Link 
            to="#" 
            className='orderBtn' 
            onClick={this.handleClick} 
            style={isClicked && displayOrder? { backgroundColor: '#CCC'} : { backgroundColor: 'white' }}>
              Order
            </Link>
          <div id="orderBox" style={isClicked && displayOrder? { display: 'inline-block'} : { display: 'none' }}>
            <MyComponents.MyDinamicOrder handleButtonClick={this.handleClick} />
          </div>
        </NavItem>
        }
      </div>

    );
  }

  render() {
    return (
      <div>
        {this.order(2)}
      </div>
    );
  }
}
class MyDinamicFilter extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    displayFilter = !displayFilter; // deixar de dar display ao order
    displayOrder = false;

    this.setState({
      isClicked: displayFilter,
    });
    
  }

  filter() {
    const { isClicked } = this.state;

    return (
      <NavItem>
        <Link 
          to="#" 
          className='filterBtn' 
          onClick={this.handleClick} 
          style={isClicked && displayFilter ? { backgroundColor: '#CCC'} : { backgroundColor: 'white' }}
        > 
          Filter
        </Link>
        <div id="filterBox" style={isClicked && displayFilter? { display: 'inline-block'} : { display: 'none' }}>
          <CheckboxContainer onApply={this.handleClick}/>
        </div>
        
      </NavItem>
    );
  }

  render() {
    return (
      <div>
        {this.filter()}
      </div>
    );
  }
}
class CheckboxContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: new Map(),
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    
  }

  printActiveCheckboxes = () => { // change to applyFilters

    const boxes = document.querySelectorAll('input[type="checkbox"]');

    let rows = [];
    boxes.forEach(function (checkbox) {

      // Restore the checked state from localStorage
      const isChecked = localStorage.getItem(checkbox.name) === "true";
      checkbox.checked = isChecked;
      if (isChecked) {
        rows.push(checkbox.name);
      }
  
    });

    localStorage.setItem( 'SelectedBoxes', rows );
    
  }

  handleApply = () => {
    this.printActiveCheckboxes();

    // Call the onApply prop passed from the parent component
    this.props.onApply();
  };

  render() {
    return (
      <>
      <div id='filterTitle'>
        Show...
      </div>
      <React.Fragment>
        <div id='check_box_list'>
        {
          checkboxes.map(item => (
            <label key={item.key}>
              <input type="checkbox" name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
              {item.name}
            </label>
          ))
        }
        </div>
        <Link class="button-19" role="button" to="#" onClick={this.handleApply} >APPLY</Link>
      </React.Fragment>
      </>
    );
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      // Store the checked status in localStorage
      localStorage.setItem(checkbox.name, checkbox.checked);
    });

    // Restore the checked state from localStorage
    const isChecked = localStorage.getItem(checkbox.name) === "true";
    checkbox.checked = isChecked;

  });
});


/* AUXILIAR FUNCTIONS */
const MyComponents = {

  Clean_contents: function DatePicker(props) {

    var change = localStorage.getItem( 'changeIAP' ) || -1; 
    //console.log("-change? "+change);
    if (change.includes("true")) {

      localStorage.setItem("changeIAP", "false");

      console.log(" - clear localStorage.. ");

      localStorage.removeItem("Content");
      localStorage.removeItem("OrderData");
      localStorage.removeItem("Users_ID");
      localStorage.removeItem("Objectives");
      localStorage.removeItem("Objectives_ids");
      localStorage.removeItem("Analytics");
      localStorage.removeItem("Analytics_ids");
      localStorage.removeItem("Scores");

    }

  },

  Generate_Content: function DatePicker(props) {

    var obj_eval = [];

    var myUsers = localStorage.getItem("Users_ID") || -1;
    if (myUsers != -1){ // se ja esta definido
      users = myUsers.split(",");
    }
    var myAnalytics = localStorage.getItem("Analytics") || -1;
    if (myAnalytics != -1){
      analytics = myAnalytics.split(",");
    }    


    var generateContent = localStorage.getItem( 'GenerateContent' ) || 1;

    if (generateContent.toString().includes("true")){

      var myContent = localStorage.getItem( 'Content' ) || 1;
      if (myContent != 1 ) {

        //console.log("uu  content already defined *** ");

        var myContent_array = myContent.split(",");
        var aux_row = [];
        var aux_num = 0;
        content = [];
        for (var i = 0; i < myContent_array.length; i++){
          if (aux_num != 4){
            aux_row.push(myContent_array[i]);
            aux_num++;
          }
          else{
            aux_row.push(myContent_array[i]);
            aux_num = 0;
            content.push(aux_row);
            aux_row = [];
          }
        }
        
      }
      else{      

      //console.log("uu content not defined yet ...");
      content = [];

        if (users.length !== 0) {

          var variant = "";
          for (var l = 0; l < users.length; l++) { // num_learners -> users.length
            var aux_row_id = 0;
            for (var o = 0; o < objectives.length; o++) { // props.num_objs -> objectives.length
    
              if (aux_row_id == 0){ // cria um novo id
                obj_eval.push(users[l]); //random_row_id); // random ID
                aux_row_id++;
              }
              else if (aux_row_id == objectives.length-1){
                obj_eval.push(users[l]); //random_row_id); // random ID
                aux_row_id = 0;
              }
              else if (aux_row_id > 0 && aux_row_id < objectives.length) {
                obj_eval.push(users[l]); //random_row_id); // random ID
                aux_row_id++;
              }          
              
              // percentage deixa de ser random -> da db agr:
    
              // ver qual é o ID do objective
              var objective_id = objectives_ids[o];
    

              var correspondent_analytics = [];
              var correspondent_analytics_ids = [];

              // ver quais os analytics ids deste objectivo:
              for (var a = 0; a < objectivesAnalytics.length; a++) {
                if (objectivesAnalytics[a].objective_id.toString() == objective_id){
                  correspondent_analytics_ids.push(objectivesAnalytics[a].analytics_id);
                }
              }
              // ver quais as analytics deste objectivo:
              for (var a = 0; a < analytics.length; a++) {
                if (correspondent_analytics_ids.includes(analytics[a].id)){
                  correspondent_analytics.push(analytics[a]);
                }
               }

              var correspondent_scores = [];
              for (var s = 0; s < scores.length; s++) {
                if (correspondent_analytics_ids.includes(scores[s].analytics_id)){
                  if(scores[s].objective_id == objective_id) {
                    correspondent_scores.push(scores[s]);
                  }
                }
              }
    
              // calcular a progress bar do objectivo o para o user l :
              var value = 0;
              for ( var i = 0; i < correspondent_analytics.length; i++) {
                for ( var j = 0; j < correspondent_scores.length; j++) {
                  if (correspondent_scores[j].user_id == users[l]){
                    if (correspondent_scores[j].analytics_id == correspondent_analytics[i].id){
                      for (var aa = 0; aa < objectivesAnalytics.length; aa++) {
                        if (objectivesAnalytics[aa].analytics_id == correspondent_analytics[i].id){
                          value += correspondent_scores[j].score/100 * objectivesAnalytics[aa].weight;
                          break;
                        }
                      }
                    }
                  }
                } 
              }

              variant = "success";
              value = Math.round(value);
              obj_eval.push(value);

              console.log("HERE");
              console.log("FlagsObjectives", flagsObjectives);

              var correspondent_flags_ids = [];
              for (var fo = 0; fo < flagsObjectives.length; fo++) {
                if (flagsObjectives[fo].objective_id == objective_id){
                  correspondent_flags_ids.push(flagsObjectives[fo].flag_id)
                }
              }

              var strBuilder = "";
              for (var f = 0; f < flags.length; f++) {

                if (correspondent_flags_ids.includes(flags[f].id)){
                  if (correspondent_analytics_ids.includes(flags[f].analytics_id)){
                    // ver se o value tem ou nao uma flag associada
                    if (value >= parseInt(flags[f].min_value) && value < parseInt(flags[f].max_value)) {
                      strBuilder += flags[f].flag;
                    }
                  }
                }
              }
              obj_eval.push(strBuilder); // emoji

      
              if (value < 50) {
                variant = "danger";
              } else if (value < 75) {
                variant = "warning";
              }
      
              obj_eval.push(variant); // to set the color of progress bar
              obj_eval.push(objective_id); // para passar no link dos ...
      
              content.push(obj_eval); 
              obj_eval = [];
            }
          }
            
          localStorage.setItem("Users_ID", users); // learners);
          localStorage.setItem("Content", content);

        }
      }
    }
  },

  Update_Content: function DatePicker(props) {

    MyComponents.Generate_Content();

    var slices = [];
    var row = [];
    var aux = 0;
    for (let i = 0; i < content.length; i++) {
      if (aux != objectives.length-1){                            
        row.push(content[i]);
        aux++;
        continue;
      }
      if (aux == objectives.length-1){
        row.push(content[i]);
        slices.push(row);
        row = [];
        aux = 0;
      }
    }  

    // Sort the data array based on the ordering condition
    const sortedData = [...slices].sort((row1, row2) => {
      var conditionRow1, conditionRow2;

      switch (condition_){
        case "AllBestMean":
          conditionRow1 = (parseInt(row1[0][1])+parseInt(row1[1][1]))/2;
          conditionRow2 = (parseInt(row2[0][1])+parseInt(row2[1][1]))/2;
          return conditionRow2 - conditionRow1;

        case "AllWorstMean":
          conditionRow1 = (parseInt(row1[0][1])+parseInt(row1[1][1]))/2;
          conditionRow2 = (parseInt(row2[0][1])+parseInt(row2[1][1]))/2;
          return conditionRow1 - conditionRow2;

        case "ID":        
          conditionRow1 = parseInt(row1[0][0]);
          conditionRow2 = parseInt(row2[0][0]);
          return conditionRow1 - conditionRow2;

        case "default":
          return slices;
          
      }
      if (condition_.includes("BestScore_")){
        var obj_num = parseInt(condition_.slice(condition_.indexOf('_') + 1));
        conditionRow1 = parseInt(row1[obj_num][1]);
        conditionRow2 = parseInt(row2[obj_num][1]);
        return conditionRow2 - conditionRow1;
      }
      if (condition_.includes("WorstScore_")){
        var obj_num = parseInt(condition_.slice(condition_.indexOf('_') + 1));
        conditionRow1 = parseInt(row1[obj_num][1]);
        conditionRow2 = parseInt(row2[obj_num][1]);
        return conditionRow1 - conditionRow2;
      }

    });
  
    var updatedContent = [];

    for (var i = 0; i < sortedData.length; i++){
      for (var j = 0; j < objectives.length; j++){                 
        updatedContent.push(sortedData[i][j]);
      }
    }

    content = updatedContent;
    localStorage.setItem('Content', updatedContent);

  },

  Get_Order_Condition: function DatePicker(props){
    var myCondition = localStorage.getItem( 'Condition' ) || 1;

    if (myCondition != 1) { // ja estava definida
      condition_ = myCondition;
    }
    else{ //primeira vez
      condition_ = "ID";
    }

    localStorage.setItem("Condition", condition_);

  },

  Generate_Order_data: function DatePicker(props) {

    Get_IAP_name();

    var obj_name = [];
    var myOrderData = localStorage.getItem( 'OrderData' ) || 1;

    if (myOrderData != 1) {

      var myOrderData_array = myOrderData.split(",");
      var aux_row = [];
      var aux_num = 0;
      OrderData = [];
      for (var i = 0; i < myOrderData_array.length; i++){
        if (aux_num != 2){
          aux_row.push(myOrderData_array[i]);
          aux_num++;
        }
        else{
          aux_row.push(myOrderData_array[i]);
          aux_num = 0;
          OrderData.push(aux_row);
          aux_row = [];
        }
      }

    }
    else{      

      obj_name = [];
      OrderData = [];

      obj_name.push("Best mean of all Objectives");  // name
      obj_name.push("AllBestMean");  // on click
      obj_name.push("Best mean of all Objectives");  // link name
      OrderData.push(obj_name); 
      obj_name = [];

      obj_name.push("Worst mean of all Objectives");  // name
      obj_name.push("AllWorstMean");  // on click
      obj_name.push("Worst mean of all Objectives");  // link name
      OrderData.push(obj_name); 
      obj_name = [];

      obj_name.push("Learner ID");  // name
      obj_name.push("ID");  // on click
      obj_name.push("Learner ID");  // link name
      OrderData.push(obj_name); 
      obj_name = [];

      
      // best score
      for (var o = 0; o < objectives.length; o++) {
        obj_name.push("Best Score: "+objectives[o]);  // name
        obj_name.push("BestScore_"+o);  // on click
        obj_name.push("Best Score: "+objectives[o]);  // link name
        OrderData.push(obj_name); 
        obj_name = [];
      }

      // worst score
      for (var o = 0; o < objectives.length; o++) {
        obj_name.push("Worst Score: "+objectives[o]);  // name
        obj_name.push("WorstScore_"+o);  // on click
        obj_name.push("Worst Score: "+objectives[o]);  // link name
        OrderData.push(obj_name); 
        obj_name = [];
      }

      localStorage.setItem("OrderData", OrderData);
    }  
  },

  DisplayOrderButtons: function DatePicker(props) {

    const updateCondition = (value) => {
      localStorage.setItem("changeIAP", "true");
      condition_ = value;
      localStorage.setItem("Condition", condition_);
    }

     return (
      <>
        {filteredData_global.map((item) => (
          <tr>
            <td className='tableRow'> 
              <button onClick={() => updateCondition(item[1])}>{item[2]}</button>
            </td>
          </tr>
        ))}
      </>
    );
  
  },

  Filter_rows: function DatePicker(props) {

    var objLength = objectives.length;
    var selectedBoxes = localStorage.getItem( 'SelectedBoxes' ) || 1;

    filter_slices = [];
    var row = [];
    var aux = 0;
    var fits = true;
    var toShow = [];
    var filtered = [];
    var alreadyPushed = []; // para nao inserir linhas repetidas
    var updated_users = [];

    if(selectedBoxes != 1){ // se houver alguma filter box selecionada
      const selectedBoxes_array = selectedBoxes.split(",");
      
      for (let i = 0; i < selectedBoxes_array.length; i++) {
        if (selectedBoxes_array[i].includes("Positives")) {
          filtered.push(0);   // ID
          filtered.push(50);  // min value
          filtered.push(100); // max value
          toShow.push(filtered);
          filtered = [];

        } 
        if (selectedBoxes_array[i].includes("Negatives")) {
          filtered.push(1);  // ID
          filtered.push(0);  // min value
          filtered.push(49); // max value
          toShow.push(filtered);
          filtered = [];

        }
        if (selectedBoxes_array[i].includes("below 30")) { // algum dos objetivos abaixo de ... (20% por exemplo)
          filtered.push(2);  // ID
          filtered.push(0);  // min value
          filtered.push(30); // max value
          toShow.push(filtered);
          filtered = [];
        }
        if (selectedBoxes_array[i].includes("Zero")) { // algum dos objetivos abaixo de ... (20% por exemplo)
          filtered.push(3);  // ID
          filtered.push(0);  // min value
          filtered.push(0); // max value
          toShow.push(filtered);
          filtered = [];
        }
        if (selectedBoxes_array[i].includes("emoji")) { // contem emoji
          filtered.push(4);  // ID

          filtered.push(0);  // min value
          filtered.push(0); // max value
          toShow.push(filtered);
          filtered = [];
        }
      }

      aux = 0;
      var forZeroFilter = false;
      var forEmojiFilter = false;

      for (let s = 0; s < toShow.length; s++) {
        for (let i = 0; i < content.length; i++) {

          if (toShow[s][0] == 3) { // case filter box 4
            if (content[i][1] == 0){
              forZeroFilter = true;
            }
            if (aux != objLength-1){
              row.push(content[i]);
              aux++;
              continue;
            }
            if (aux == objLength-1){
              row.push(content[i]);
              if (forZeroFilter && !alreadyPushed.includes(i)){
                updated_users.push(content[i][0]);
                filter_slices.push(row);
                alreadyPushed.push(i);
              }
              forZeroFilter = false;
              row = [];
              aux = 0;
            }              
          }
          else if (toShow[s][0] == 4) { // case filter box 5
            if (!(content[i][2] == '')){
              forEmojiFilter = true;
            }
            if (aux != objLength-1){
              row.push(content[i]);
              aux++;
              continue;
            }
            if (aux == objLength-1){
              row.push(content[i]);
              if (forEmojiFilter && !alreadyPushed.includes(i)){
                updated_users.push(content[i][0]);
                filter_slices.push(row);
                alreadyPushed.push(i);
              }
              forEmojiFilter = false;
              row = [];
              aux = 0;
            }              
          }
          else{

            if (aux != objLength-1){
              if (content[i][1] < toShow[s][1] || content[i][1] > toShow[s][2]){
                fits = false;
              }
              row.push(content[i]);
              aux++;
              continue;
            }
            if (aux == objLength-1){
              if (content[i][1] < toShow[s][1] || content[i][1] > toShow[s][2]){
                fits = false;
              }
              row.push(content[i]);
              if (fits && !alreadyPushed.includes(i)){
                updated_users.push(content[i][0]);
                filter_slices.push(row);
                alreadyPushed.push(i);
              }
              fits = true;
              row = [];
              aux = 0;
            }
          }
          
        }  

      }

      // atualizar os learners de acordo com a ordem
      localStorage.setItem("Users_ID", updated_users);
      users = updated_users;

    }
    else{ // show all the content


      for (let i = 0; i < content.length; i++) {
        if (aux != objLength-1){
          row.push(content[i]);
          aux++;
          continue;
        }
        if (aux == objLength-1){
          updated_users.push(content[i][0]);
          row.push(content[i]);
          filter_slices.push(row);
          row = [];
          aux = 0;
        }
      }  

      // atualizar os learners de acordo com a ordem
      localStorage.setItem("Users_ID", updated_users);
      users = updated_users;

    }

  },

  Show_Content: function DatePicker(props) {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const handleLinkClick = (element) => {
      //console.log(element);
      popup_userID = element;

      setPopupOpen(true);
      document.body.classList.add('no-scroll');
    };  
    const handleClosePopup = () => {
      setPopupOpen(false);
      document.body.classList.remove('no-scroll');
    };

    const Popup = ({ onClose }) => {

      return (
        <div className="popup-overlay">
          <div className="popupWithLink">
            <button class="parentBtn">
              <a class="popupLink" href={`/userIapDetails/${popup_userID}/${iapID}`} >{/*{`/userObjectiveDetails/${popup_userID}/${popup_objID}`} >*/}
                Check user progress on this IAP
              </a>
            </button>
            <button class="parentBtn">
              <a class="popupLink" href={`/userAllIaps/${popup_userID}`} >
                Check user progress on all IAP's
              </a>
            </button>
            <button className="closeBtn" 
                    style={{width:'5em', marginLeft: '0', marginTop:'1em', transform:'translate(120%,0%)'}} 
                    onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      );
    };

    return (
      <>
      {filter_slices.map((row, index) => (
        <tr>

        <td className="learnerId_td">
          <a  className="learnerIdLink" 
              href="#"
              onClick={() => handleLinkClick(users[index])}>
          {users[index]}
          </a>
          {isPopupOpen && <Popup onClose={handleClosePopup}/>}
        </td> 

        {row.map((element) => ( // row element
          <td>
          <div className='td42'>
            <ProgressBar variant={element[3]} now={element[1]} label={`${element[1]}%`}>
              <div  className={`progress-bar variant-bg${element[3]}`} 
                    style={{  width: element[1] < 10 ? '20px' : `${element[1]}%`,
                              backgroundColor: element[3] == 'success' ? '#3cb371': element[3] == 'warning' ? '#f5c71a' : '#cb4154'}}>
                {element[1]}
              </div>
            </ProgressBar>
            
            <div className='td42'>
              <span style={{marginLeft: '1em', marginRight: '1em'}} className="emoji" role="img" aria-label="Emoji">{element[2]}</span>
            </div>
          </div>

          </td>
        ))}
        </tr>
      ))}
    </>
    );
  },

  IAP_analisys: function DatePicker(props) { 

    return(
      <>  
      <MyComponents.Generate_Content/>

      <Table style={{marginTop: '1em'}} striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Learners ID</th>
            {objectives.map((objective, index) => //props.state.objectives -> objectives
              <th key={index}>
                <Link to={`/objectiveDetailsPage/${objectives_ids[index]}`} style={{ color: 'black' }}>{objective}</Link>
              </th>
            )}           
          </tr>
        </thead>
        <tbody>
          <MyComponents.Filter_rows/>
          <MyComponents.Show_Content/>
        </tbody>
      </Table>
      </>
      );

       
  },

  MyDinamicOrder: function DatePicker(props) {
    const [filter, setFilter] = useState('');

    const handleChange = (event) => {
      setFilter(event.target.value);
    };
  
    const filteredData = OrderData.filter(
      (item) => item[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );


    filteredData_global = filteredData;
  
    return (
      <>
        <div id="elementsHere">
          <input className='orderInput'
            type="text"
            placeholder="Search order.."
            value={filter}
            onChange={handleChange}
          />
          <Link class="button-19" role="button" to="#" onClick={props.handleButtonClick} >APPLY</Link>
        </div>
        <Table id="attempt">
          <MyComponents.DisplayOrderButtons/>
          <MyComponents.Update_Content/>
        </Table>
      </>
    );
  },
}


/* EXPORT CLASS */
class DashBoard extends React.Component {

  state = {
    iap: {},
    objectives: []
  }

  componentDidMount() {

    window.addEventListener('beforeunload', this.handleBeforeUnload);

    localStorage.setItem("changeIAP", "true");

    // clear values
    content = [];
    localStorage.setItem("Condition", "ID");
    condition_ = "ID";

    if (this.props.id) {
      fetch(process.env.REACT_APP_BACKEND + '/iap/' + this.props.id)
        .then(res => res.json())
        .then((data) => {
          //console.log("IAP Data " + JSON.stringify(data))
          this.setState({
            iap: data,
            objectives: data.objectives
          })
        })
        .catch(console.log)
    }

    axios.get('/users') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        users = [];

        for (var i = 0; i < response.data.length; i++){
          users.push(response.data[i].id);
        }

        var myUsers = localStorage.getItem( 'Users_ID' ) || -1; 
        if (myUsers != -1) {
          users = myUsers.split(",");  
        }
        else {
          localStorage.setItem("Users_ID", users);
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/iaps') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        iaps = response.data;
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/objectives') // Assuming the server is running on the same host and port as your React app
      .then(response => {

        objectives = []; // clear
        objectives_ids = [];

        for (var i = 0; i < response.data.length; i++){
          if (response.data[i].iap_id == iapID){ // objectivo corresponde à IAP que etsamos a analisar 
            objectives.push(response.data[i].name);
            objectives_ids.push(response.data[i].id);
          }
        }
        
        var myObjectives = localStorage.getItem( 'Objectives' ) || 1; 
        if (myObjectives != 1) {

          if (myObjectives.split(",") != objectives) { 
            localStorage.setItem("changeIAP", "true");
            localStorage.setItem("GenerateContent", "true");
          }
          else {
            localStorage.setItem("changeIAP", "false;");
          }

          objectives = myObjectives.split(",");  

        }
        else {
          localStorage.setItem("changeIAP", "false;");
          localStorage.setItem("Objectives", objectives);
        }

        var myObjectives_ids = localStorage.getItem( 'Objectives_ids' ) || 1; 
        if (myObjectives_ids != 1) {
          objectives_ids = myObjectives_ids.split(",");  
        }
        
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/allAnalytics') 
      .then(response => {
        analytics = []; // clear
        analytics_ids = [];

        for (var i = 0; i < response.data.length; i++){
            analytics.push(response.data[i]);
            analytics_ids.push(response.data[i].id);
        }

        var myAnalytics = localStorage.getItem( 'Analytics' ) || 1; 
        if (myAnalytics != 1) {
          analytics = myAnalytics.split(",");  
        }

        var myAnalytics_ids = localStorage.getItem( 'Analytics_ids' ) || 1; 
        if (myAnalytics_ids != 1) {
          analytics_ids = myAnalytics_ids.split(",");  
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/flagsobjectives') 
      .then(response => {
        flagsObjectives = []; // clear

        for (var i = 0; i < response.data.length; i++){
          flagsObjectives.push(response.data[i]);
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/objectivesanalytics') 
      .then(response => {

        objectivesAnalytics = []; // clear
        objectivesAnalytics_objIDs = []; // clear

        for (var i = 0; i < response.data.length; i++){
          if (objectives_ids.includes(response.data[i].objective_id)){  
            objectivesAnalytics.push(response.data[i]);
            objectivesAnalytics_objIDs.push(response.data[i].objective_id); // clear
          }
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/scores') 
      .then(response => {

        scores = [];
        for (var i = 0; i < response.data.length; i++){
          if (analytics_ids.includes(response.data[i].analytics_id)){ 
            scores.push(response.data[i]); // score de um user numa analitica 
          }
        }

        var myScores = localStorage.getItem( 'Scores' ) || 1; 
        if (myScores != 1) {
          scores = myScores.split(",");  
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/flags') 
      .then(response => {
        flags = []; // clear

        for (var i = 0; i < response.data.length; i++){
            flags.push(response.data[i]);
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

  }

  render(){
    return (
      <>
        <MyComponents.Generate_Order_data/>
        <MyComponents.Get_Order_Condition/>
        <CssBaseline/>
        <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
          <Nav className="mr-auto">
            <h1 style={{ marginLeft: '0.5em', fontSize: '32px' }}>
              {(() => {
                for (var i = 0; i < iaps.length; i++) {
                  if (iaps[i].id.toString() == iapID){
                    iapName = (iaps[i].name);
                  }
                }
              })()}
              < MyComponents.Clean_contents/>
              Objectives progress for "{iapName}" IAP 
            </h1>
          </Nav>
          <Nav >
            <Filter_and_Order/>
          </Nav>
        </Navbar>
        <hr></hr>
        <MyComponents.IAP_analisys/>
      </>
    );
  }
}
export default DashBoard



