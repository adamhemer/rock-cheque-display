import React from "react";
import "./index.css";
import Category from "./Category";
import Player from "./Player";
import axios from "axios";

const STATES = {
    SETUP: 0,       // Asigning players to buzzers, choosing colours, etc
    DEMO: 1,        // Let players try out the remotes
    SELECTION: 2,   // On the category board
    WAITING: 3,     // Question shown but players cant buzz yet
    ARMED: 4,       // Players can buzz in
    BUZZED: 5,      // A player has buzzed in
    ANSWERED: 6,    // The question has been answered correctly, show answer
    TIEBREAK: 7,    // Extra question for tiebreaking
    GAMEOVER: 8     // All questions are complete, show final scores
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            showQuestion: false,
            showGrid: true
        };

        this.serverAddress = "http://127.0.0.1:8000/";
        this.server = axios.create({
            baseURL: this.serverAddress,
            timeout: 1000
        })

        this.colours = [
            "#5bc0ebff",
            "#c3423fff",
            "#eae151ff",
            "#404e4dff",
            "#558564ff",
            "#ff88dcff",
            "#6622ccff"
        ]
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        if (this.fetchTimeout) {
            clearTimeout(this.fetchTimeout);
        }
    }

    fetchData = () => {
        this.server.get('board-data')
            .then(res => {
                console.log(res);
                this.setState({ board: res.data }, () => {
                    this.fetchState();
                    this.refreshCategories();
                });
            });
    }

    fetchState = () => {
        this.server.get('game-state')
            .then(res => {
                console.log(res);

                this.setState({ gameState: res.data }, () => {
                    if (this.state.gameState.state >= STATES.WAITING && this.state.gameState.state <= STATES.ANSWERED) {
                        console.log("Question")
                        this.setState({ showQuestion: true, showGrid: false });
                    } else {
                        this.setState({ showQuestion: false, showGrid: true });
                    }

                });

                this.fetchTimeout = setTimeout(this.fetchState, 1000)

            });
    }

    refreshCategories() {
        let catObj = [];

        this.state.board.forEach((cat, i) => {
            catObj.push(<Category key={i} name={cat.title} questions={cat.questions} backgroundColour={this.colours[i]} ></Category>);
        });

        this.setState({ categoriesObj: catObj });

    }

    playerFooter() {
        if (!this.state.gameState) { return; }
        return (
        <div className="PlayerFooter">
            {this.state.gameState.players.map(p => <Player name={p.name} score={p.points}></Player>)}
        </div>)
    }

    render() {
        return (
            <div className="App">
                <div
                    className="FlexContainer QuestionDisplay"
                    style={{ display: this.state.showQuestion ? "flex" : "none" }}
                >

                    <div className="QuestionContent">
                        <p className="QuestionContentTitle">What is this?</p>
                        <video className="video" controls>
                            <source src="epicbreach.mp4" type="video/mp4"></source>
                        </video>


                        <p className="QuestionContentAnswer">Answer: Border Collie</p>
                    </div>
                </div>
                <div
                    className="FlexContainer QuestionGrid"
                    style={{ display: this.state.showGrid ? "flex" : "none" }}
                >

                    {this.state.categoriesObj}

                    {/* <Category
                        name="Cat1"
                        questionCount="4"
                        backgroundColour="var(--aero)"
                    ></Category>
                    <Category
                        name="Test"
                        questionCount="3"
                        backgroundColour="var(--persian-red)"
                    ></Category>
                    <Category
                        name="Animals"
                        questionCount="5"
                        backgroundColour="var(--maize)"
                    ></Category>
                    <Category
                        name="Famous quotes"
                        questionCount="7"
                        backgroundColour="var(--persian-pink)"
                    ></Category>
                    <Category
                        name="The big boyz"
                        questionCount="3"
                        backgroundColour="var(--french-violet)"
                    ></Category> */}
                    {/* <Category name="The big boyz"   questions={[{ type: "Video",  question: "What is this?", pointValue: 100, source: "epicbreach.mp4" }, { type: "Text", pointValue: 1000, question: "I don't know" }]} backgroundColour="var(--french-violet)"></Category> */}
                </div>
                {this.playerFooter()}
                {/* <div className="PlayerFooter">
                    <Player name="Adam" score="100"></Player>
                    <Player name="Callum" score="100"></Player>
                    <Player name="Emily" score="100"></Player>
                    <Player name="Koni" score="100"></Player>
                    <Player name="Hayley" score="100"></Player>
                    <Player name="Lauren" score="100"></Player>
                    <Player name="James" score="100"></Player>
                    <Player name="Beth" score="100"></Player>
                </div> */}
            </div>
        );
    }
}

export default App;
