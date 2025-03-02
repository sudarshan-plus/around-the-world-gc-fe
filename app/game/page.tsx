'use client';
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './page.css';
import { db } from "@/firebase.config.mjs";
import { onValue, ref, set } from "firebase/database";
import { redirect } from "next/navigation";
export default function Game() {
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(false);
  const [userNameText, setUserNameText] = useState("");
  const handleClose = () => {
    setShow(false);
    setLogin(false);

  };
  const handleShow = (usernameText: string) => {
    setShow(true);
    setUserNameText(usernameText);
  }
  const [input, setInput] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [username, setUserName] = useState([] as any[]);
  useEffect(() => {
    if (input.length > 3 && input.length < 10) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    console.log(input);
  }, [input]);


  const setUserNameInRTDB = () => {
    setUserNameText("Username is available.");
    setUserName([input]);
    set(ref(db as any, 'usernames/' + input), [input]).then(() => {
      // Success.
      // console.log([input]);
      setDisabled(true);
      setUserNameText("Username (" + input + ") created Successfully. Please close the window.");
    }).catch((error) => {
      setUserNameText("Could not create username. Please try again.");
      console.log(error);
    });
  }


  const validateUserInput = () => {
    const query = ref(db as any, "usernames/" + input);
    return onValue(query, (snapshot: any) => {
      const data: any = snapshot.val();

      if (login && data == null) {
        setUserNameText("Could not find username. Please register.");

      }
      else if (data == null && !login) {
        setUserNameInRTDB();

      }
      else if (data != null && login) {
        setUserNameText("Username (" + input + ") logged in Successfully. Please close the window to continue.");
        handleClose();
        redirect(`/game/start?username=${input}`);
      }



      else if (snapshot.exists()) {
        Object.values(data).map((usrname: any) => {
          if (!usrname.includes(input)) {

            setUserNameText("Username is available.");
            setUserName(usrname);
          } else {
            setUserNameText("Username already exists. Please enter a different username or Login.");
          }

        });
      }
      else {
        setUserNameText("Something Went Wrong.")
      }
    });
    // }, []);
  }





  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold">
        This is a game 🎮 where you have to guess the name of a country based on a clue 🕵️.
      </h2>
      <h4>
        The rules are simple:
        <ul>
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
        <Button variant="primary" onClick={() => handleShow("Enter a unique username (3 - 10 characters):")}>
          Create Your Username
        </Button>
      </div>
      <span>OR</span>
      <div className="p-2">
        <Button onClick={() => {
          handleShow("Enter your username");
          setLogin(true);
        }} >
          Login
        </Button>
      </div>
      <div >
        <Modal show={show} onHide={() => handleShow} centered style={{ color: 'black' }} >

          <Modal.Body >
            {userNameText}
            <input type="text" placeholder="Enter Username" className="input-group form-control" onInput={e => setInput(e.currentTarget.value)} minLength={3} maxLength={10} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" disabled={disabled} onClick={validateUserInput}>
              {login ? "Login" : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}