import {
  Container,
} from "@chakra-ui/react";
import TasteWidget from "./movies/TasteWidget";
import MovieWidget from "./movies/moviewidget";
import ShowWidget from "./shows/showwidget";
import ChannelWidget from "./liveshowwidget";
import DdWidget from "./movies/dowloadedwidget";



const Home = () => {
  
 

  return (
    <Container 
     maxW={"container.xl"}>

      {/* {loading && <div>Loadin...</div>} */}
      <MovieWidget/>
      <ShowWidget/>
      <TasteWidget />
      <DdWidget></DdWidget>
     <ChannelWidget/>
    </Container>
  );
};

export default Home;
