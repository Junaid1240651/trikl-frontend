import React, { useState, useEffect } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import LoadinScreen from "../Components/LoadingScreen/LoadingScreen";

const HomePage = () => {
  const [imageData, setImageData] = useState();
  const [textBoxes, setTextBoxes] = useState([]);
  const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
  const [selectedTextArea, setSelectedTextArea] = useState(null);
  const [clickCheck, setClickCheck] = useState(0);

  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/photos/?client_id=" +
          process.env.REACT_APP_UPSLASHID
      )
      .then((response) => {
        const imageUrl = response.data[1].urls.raw;
        console.log("Image URL:", imageUrl);
        setImageData(imageUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleImageClick = (e) => {
    if (!isTextAreaVisible) {
      const imageContainer = e.currentTarget;
      const containerRect = imageContainer.getBoundingClientRect();

      const screenHeight = window.innerHeight;

      const positionX = e.clientX - containerRect.left;
      const positionY = e.clientY - containerRect.top - screenHeight;

      const newTextBox = {
        id: Date.now(),
        text: "",
        position: { x: positionX, y: positionY },
      };
      console.log(newTextBox);
      setTextBoxes((prevTextBoxes) => [...prevTextBoxes, newTextBox]);
      setIsTextAreaVisible(true);
    }
    setSelectedTextArea(null);
    if (clickCheck <= 3) {
      setClickCheck(clickCheck + 1);
    }
  };

  const handleTextDrag = (id, _, data) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((textBox) =>
        textBox.id === id
          ? { ...textBox, position: { x: data.x, y: data.y } }
          : textBox
      )
    );
  };
  console.log(textBoxes);

  return (
    <>
      {imageData ? (
        <div className="main-Div" alt="imag" style={{ width: "100%" }}>
          {imageData && (
            <img
              src={imageData}
              alt="imag"
              style={{ width: "100%", height: "100vh" }}
              onClick={handleImageClick}
            />
          )}
          {textBoxes.map((textBox) => (
            <Draggable
              key={textBox.id}
              position={textBox.position}
              onDrag={(e, data) => handleTextDrag(textBox.id, e, data)}
            >
              <textarea
                spellcheck="false"
                style={{
                  resize: "none",
                  background: "transparent",
                  border:
                    selectedTextArea === textBox.id ||
                    textBox.text.length === 0 ||
                    clickCheck === 1
                      ? "2px solid red"
                      : "none",
                  fontSize: "30px",
                  height: "35px",
                  width: `${Math.max(20, textBox.text.length * 20)}px`,
                  color: "red",
                  overflow: "hidden",
                  outline: "none",
                  fontWeight: "bold",
                }}
                value={textBox.text}
                onClick={() => setSelectedTextArea(textBox.id)}
                onChange={(e) =>
                  setTextBoxes((prevTextBoxes) =>
                    prevTextBoxes.map((tb) =>
                      tb.id === textBox.id
                        ? { ...tb, text: e.target.value }
                        : tb
                    )
                  )
                }
              />
            </Draggable>
          ))}
        </div>
      ) : (
        <LoadinScreen />
      )}
    </>
  );
};

export default HomePage;
