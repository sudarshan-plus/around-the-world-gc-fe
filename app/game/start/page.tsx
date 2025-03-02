'use client';
import {  Container, Row, ProgressBar, Image, InputGroup, Form } from "react-bootstrap";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import Confetti from "react-confetti";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import './page.css';
export default function Start(props: any) {

    const [hidden, setHidden] = useState(false);
    const [time, setTime] = useState(5); // Start from 5 seconds
    const searchParams = useSearchParams();
    const username = searchParams.get('username');

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
        if (
            time == 0
        ) {
            setHidden(true);
        }
    }, [time]);

    return (

    <Suspense fallback={null}>
        <Container>
            <Container hidden={hidden} className="text-center mt-2">
                <h2>⏳ Game starts in: {time}s</h2>
                <ProgressBar
                    animated
                    now={(time / 5) * 100} // Convert time to percentage
                    variant="danger"
                    style={{ height: "20px", width: "50%", margin: "0 auto" }}
                />
            </Container>


            <Container className="text-center mt-5">

                <CityClue hidden={!hidden} username={username} />
            </Container>
        </Container>
        </Suspense>
    );
};


const CityClue = ({ hidden, username }: any) => {
    const [clue, setClue] = useState("");
    const [city, setCity] = useState("");
    const [userGuess, setUserGuess] = useState("");
    const [loading, setLoading] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [points, setPoints] = useState(0);
    const [lives, setLives] = useState(3);
    const [submit,setSubmit]= useState(false);
    const [clueCalledTimes,setClueCalledTimes]= useState(0);
    if(username==undefined || username == ''){
        username = 'Anonymous';
    }
    const getCityClue = async (sameCity =false)  => {
        if(clueCalledTimes==0){
            setClueCalledTimes(clueCalledTimes+1);
            
            
        }
        else if(clueCalledTimes>0){
            sameCity = true;
            setClueCalledTimes(clueCalledTimes+1);
            setLives(lives-1);
        }
        setSubmit(false);
        setLoading(true);
        setClue("");
        setCity("");
        setCorrect(false);
        setUserGuess("");

        try {
            const url = sameCity ? `/api/getUniqueClue?city=${city}` : "/api/getCityClue";
            const response = await fetch(url);
            const data = await response.json();
            setClue(data.clue);
            if(!sameCity){
                setCity(data.answer);
            }
        } catch (error) {
            setClue("Error fetching clue.");
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        setPoints(0);
        setLives(3);
        getCityClue();
    };
   
    const checkAnswer = () => {
        console.log(userGuess);
        console.log(city);
        if (userGuess && city && userGuess.toLowerCase() === city.toLowerCase()) {
            setCorrect(true);
            setPoints(points + 1);
            setClueCalledTimes(0);
        } else {
            setCorrect(false);
            setLives(lives - 1);
            if(lives==0){
                setPoints(0);
                setLives(3);

            }
        }
    };

    return (
        <Container hidden={hidden}>
                    {correct && <Confetti />}

         
                <div className="d-flex justify-content-end">
                    <Row>
                    <InputGroup>
                        <InputGroup.Text>User: {username }</InputGroup.Text>
                        <InputGroup.Text>Points: {points}</InputGroup.Text>
                        <InputGroup.Text>Lives: {lives}</InputGroup.Text>
                        
                    </InputGroup>    
                    </Row>
                    
                </div>
                <Card className="text-center p-4">
               {/* { !loading && clue  && <CityGuessTimer time ={10} onTimeUp={handleTimeUp} />} */}

                    {!correct &&
                        <div hidden={hidden} className="d-flex justify-content-center mt-5 mb-5">
                            <Image hidden={hidden} src={'/globe.jpeg'} style={{ maxWidth: '30%', height: 'auto' }} alt={`Image of Globe`} className="mt-3 blurred-svg" fluid rounded />

                        </div>
                    }
                    {correct && (
                        <>
                            <CityImage city={city} hidden={hidden} /> {/* Pass city name as prop */}
                        </>
                    )}
                    <Card.Title>🔍 Guess the City!</Card.Title>
                    <Card.Text>
                        {loading ? <Spinner animation="border" /> : clue || "Click the button to get a clue!"}
                    </Card.Text>

                    {!loading && clue && (
                        <>
                            <Form.Control
                                type="text"
                                placeholder="Enter your guess..."
                                value={userGuess}
                                onChange={(e) => setUserGuess(e.target.value)}
                                className="mb-3"
                            />
                            <Button variant="success" onClick={()=>{checkAnswer();
                                setSubmit(true);
                            }}>Submit Answer</Button>
                        </>
                    )}

                    {correct && <Alert variant="success" className="mt-3">🎉 Correct! The city is {city}!</Alert>}

                    {!correct && !loading && submit &&(
                        <Alert variant="danger" className="mt-3">
                        {lives!=0 &&    `❌ Incorrect! Try again!  ${lives} lives left`}
                        {lives==0 && `❌ Incorrect! Game Over! Your score is ${points}`}
                        {lives==0 && <Button variant="primary" onClick={refresh} >Retry</Button>}
                        </Alert>
                    )}

                    <Button variant="primary" onClick={()=>getCityClue(false)} disabled={loading } className="mt-3">
                       {clueCalledTimes ==0 && "Get New Clue"}
                       {loading && "Get New Clue"}
                       {clueCalledTimes > 0 && !loading &&  `Get Another Clue. You will lose a life! ${lives} lives left`}
                    </Button>
                </Card>
            </Container>
    );
};






const CityImage = ({ city, hidden }: any) => {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!city) return;

        const fetchCityImage = async () => {
            setLoading(true);
            setImageUrl("");
            setError("");

            try {
                const response = await fetch(`/api/getCityImage?city=${city}`);
                const data = await response.json();

                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                } else {
                    setError(data.error || "No image found");
                }
            } catch (err) {
                setError("Failed to fetch image");
            } finally {
                setLoading(false);
            }
        };

        fetchCityImage();
    }, [city]); // Re-run when `city` changes

    return (
        <Card className="text-center p-4">
            <Card.Title>🌆 {city ? `Image of ${city}` : "Enter a City"}</Card.Title>

            {loading && <Spinner animation="border" className="mt-3" />}
            {error && <p className="text-danger mt-3">{error}</p>}

            {imageUrl && (
                <Image hidden={hidden} src={imageUrl} alt={`Image of ${city}`} className="mt-3" fluid rounded />
            )}
        </Card>
    );
};