import React, {useState,useEffect,useRef} from 'react';
import Card from './Card'
import axios from 'axios';

// our api url
const BASE_URL = 'http://deckofcardsapi.com/api/deck';
// going to make a component that draws child Card components with a couple of props, img and name for the cards

const Deck = () => {
    // need to keep track of a deck using its deck id but first we need to set a deck into the state so we can track it 

    const [deck,setDeck] = useState(null);

    // lets get the data for the deck from the API
    // we are going to utilize the useEffect hook whenever we have to make an API call 


    useEffect(() => {
        // create an async function so we can await the deck response
        async function getNewDeck(){
            // await the response and ask for a shuffled deck from the API
            let newDeck = await axios.get(`${BASE_URL}/new/shuffle`);
            // now we should have our data from the api which comes back in this format
            // {
            //     "success": true,
            //     "deck_id": "3p40paa87x90",
            //     "shuffled": true,
            //     "remaining": 52
            // }
            // lets update our state
            setDeck(newDeck.data);
        }
        // now we can call our function so that the deck is set when we render the Deck component 
        getNewDeck();
        // our only dependency should be the setDeck which most likely will stay static
    },[setDeck]);

    // lets use useEffect again to draw a card but we need some state for the cards 
    // we can keep track of them in an array
    const [drawn,setDrawn] = useState([]);
    useEffect(()=> {
        // create a function that makes an API call that grabs our card data so we can insert a new Card component with that data to the DOM 
        async function drawCard() {
            // we need to insert a deck id to let the api which deck we are drawing from , we can destructure this 
            let {deck_id} = deck;
            // draw using the API
            try{let drawResponse = await axios.get(`${BASE_URL}/${deck_id}/draw/`);
            // grab the data for the remaining cards and see if its at 0
            let remainingCards = drawResponse.data.remaining;
            // no more cards in the deck throw an error
            if(remainingCards===0){
                // this feels like Node js again
                throw new Error("There are no more cards in the deck!")
            }
            // grab the card data from the api which provides the following data for us to use

            const cardData = drawResponse.data.cards[0];
            // we get this kind of data back , an array of all the cards we drew even if its only 1 card

            // {
            //     "success": true,
            //     "cards": [
            //         {
            //             "image": "https://deckofcardsapi.com/static/img/KH.png",
            //             "value": "KING",
            //             "suit": "HEARTS",
            //             "code": "KH"
            //         },
            //         {
            //             "image": "https://deckofcardsapi.com/static/img/8C.png",
            //             "value": "8",
            //             "suit": "CLUBS",
            //             "code": "8C"
            //         }
            //     ],
            //     "deck_id":"3p40paa87x90",
            //     "remaining": 50
            // }

            // once we make that api call then we want to copy and add a card to the array of our cards, we will be mapping over these to create the Card components
            setDrawn(drawnCard => [...drawnCard,{id:cardData.code,sourceImage:cardData.image}]);
            // in case we have an error we can just console log it 
            
        }catch(err){
            console.log(err);
        }

        }
        

    },[setDrawn]);

    const cards = drawn.map(card => (
        <Card imageSource="https://deckofcardsapi.com/static/img/KH.png" />
    ))
    
    const handleAdd = () => {
        setDrawn( d => [...drawn,{imageSource:"https://deckofcardsapi.com/static/img/KH.png"}])
    }

    return (
        <div>
            <button onClick={handleAdd}>Draw a card</button>
            <div>{cards}</div>
            
        </div> 

    );
};

export default Deck;