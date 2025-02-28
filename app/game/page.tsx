'use client';
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './page.css';
export default function Game() {
  const [show, setShow] = useState(false);
  const [userNameText, setUserNameText] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);
    setUserNameText("Enter a unique username (3 - 10 characters):");
  }
  const validateUserInput = () => {
    //search for input in firebase;
  } 
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold">
        This is a game 🎮 where you have to guess the name of a country based on a clue 🕵️.
      </h2>
      <h3>
        A game is never interesting 🤔 without it's rules.
      </h3>
      <h4>
        The rules are simple:
        <ul>
          <li>
            ⭐️ You have 30 seconds to guess the country.
          </li>
          <li>
            ⭐️ You have 3 lives.
          </li>
          <li>
            ⭐️ If you guess the country correctly, you get 1 point.
          </li>
          <li>
            ⭐️ If you guess the country incorrectly, you lose a life.
          </li>
        </ul>
      </h4>
      <div className="d-flex justify-content-center p-3">
        <Button variant="primary" onClick={handleShow}>
          Create Your Username
        </Button>
      </div>
      <span>OR</span>
      <div className="p-2">
        <Button>
          Login
        </Button>
      </div>
      <div >
        <Modal show={show} onHide={handleShow} centered style={{color:'black'}} >
         
          <Modal.Body >
            {userNameText}
            <input type="text" className="form-control" minLength={3} maxLength={10} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={validateUserInput}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}