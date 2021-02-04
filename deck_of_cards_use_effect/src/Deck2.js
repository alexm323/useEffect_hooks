import React, {useState,useEffect,useRef} from 'react';
import Card from './Card'
import axios from 'axios';
const BASE_URL = 'http://deckofcardsapi.com/api/deck';

const Deck2 = () => {
    const [deck,setDeck] = useState('');
    const [drawn,setDrawn] = useState([]);
    const [currentCard,setCurrentCard] = useState({});


    useEffect(() => {
        async function getNewDeck(){
            let newDeck = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(newDeck.data);
        }
        getNewDeck();
    },[setDeck]);


    useEffect(()=> {
        async function drawCard() {
            console.log('running drawCard')
            let {deck_id} = deck;
            console.log(deck_id)
            let drawResponse = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

            let remainingCards = drawResponse.data.remaining;

            if(remainingCards===0){

                throw new Error("There are no more cards in the deck!")
            }
            const cardData = drawResponse.data.cards[0];
            console.log(cardData)
            setCurrentCard(cardData)
        }
        drawCard();
        console.log(drawn)
        
    },[drawn]);

    const cards = drawn.map(card => (
        <Card key={card.id} id={card.id} imageSource={card.sourceImage} alt={card.id}/>
    ))
    const handleClick = () => {
        setDrawn(drawnCard => [...drawn,{id:currentCard.code,sourceImage:currentCard.image}]);
    }

    return (
        <div>
            <button onClick={handleClick}>Draw a card</button>
            <div>{cards}</div>
        </div> 

    );
};

export default Deck2;