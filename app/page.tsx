// import Image from "next/image";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import './page.css'
export default function Home() {
  // const [showImage, setShowImage] = useState(true);

  // const handleImageClick = () => {
  //   setShowImage(!showImage);
  // };
  return (
    <Container>
    <Row className="mt-4">
      <Col></Col>
      <Col xs={6} md={4}>
      <Image
          src="/around-the-world-challenge.jpg"
          alt="Game logo"
          rounded
          className={ 'pop-up' }
          style={{ cursor: 'pointer' }}
        ></Image>
      </Col>
      <Col></Col>
    </Row>
    <Row className="mt-5">
      <Col xs={2} md={2}></Col>
      <Col xs={8} md={8}>
      <h2 className="pop-up">Welcome to, Around The World 🌏 Globetrotter Challenge 😃</h2>
      </Col>
      <Col xs={2} md={2}></Col>
    </Row>
    <Row className="mt-3">
      <Col className="text-center">
      <h2 className="pop-up">
        <Button variant="primary" href="/game">
          Let's Begin
        </Button>
      </h2>
      </Col>
    </Row>
  </Container>

    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //     <Image
    //       className="dark:bg-gray-900"
    //       src="/around-the-world-challenge.jpg"
    //       alt="Game logo"
    //       width={250}
    //       height={30}
    //       priority
    //     />
      
    //   </main>
    //   <div className="flex flex-col gap-8 row-start-2 items-center md:items-start">
    //       <h1>Welcome to Around The World Globtrotter Challenge</h1>
    //   </div>
    // </div>

  );
}
