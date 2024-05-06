import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const FlagSlider = ({ initialState, onClose, onSave }) => {
  const [state, setState] = useState({
    // other properties
    sliderValue: initialState?.sliderValue || [0, 50, 100],
    emojiValues: initialState?.emojiValues || ['','']
  });
  
  const [selectedInput, setSelectedInput] = useState(null);

  const handleSliderChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      sliderValue: value
    }));
  };
  

  const handleEmojiChange = (value, index) => {
    setState((prevState) => {
      const emojiValues = [...prevState.emojiValues];
      emojiValues[index] = value;
      return {
        ...prevState,
        emojiValues: emojiValues
      };
    });
  };
  

  const handleInputFocus = (index) => {
    setSelectedInput(index);
  };

  const handleAddValue = () => {
    const newValue = Math.floor(Math.random() * 100);
    setState((prevState) => ({
      ...prevState,
      sliderValue: [...prevState.sliderValue, newValue],
      emojiValues: [...prevState.emojiValues, '']
    }));
  };
  

  const handleSave = () => {
    // Call the onSave prop and pass the current state to save it
    onSave(state);
    onClose();
  };

  return (
    <div className="popup9">
      <div className="popup-content">
        <h2>Emoji Slider</h2>
        <Slider
          range
          defaultValue={[0, 50, 100]}
          min={0}
          max={100}
          value={state.sliderValue}
          onChange={handleSliderChange}
        />
        {state.sliderValue.map((value, index) => {
          if (index !== state.sliderValue.length - 1) {
            const emojiIndex = index;
            return (
              <div key={index} className="emoji-input-container">
                <p>Range {emojiIndex + 1}</p>
                <div className="emoji-input-wrapper">
                  <input
                    type="text"
                    value={state.emojiValues[emojiIndex]}
                    onChange={(event) => handleEmojiChange(event.target.value, emojiIndex)}
                    onFocus={() => handleInputFocus(emojiIndex)}
                    className="input-box"
                  />
                  {selectedInput === emojiIndex && (
                    <div className="emoji-picker-wrapper">
                      <EmojiPicker
                        emojiStyle="google"
                        onEmojiClick={(emojiObject) =>
                          handleEmojiChange(emojiObject.emoji, emojiIndex)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })}
        <button className="button-4" onClick={handleAddValue}>Add Value</button>
        <br></br>
        <br></br>
        <button className="save" id="button-5" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default FlagSlider;
